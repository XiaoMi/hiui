'use strict'

/**
 * Drop-in replacement for @changesets/changelog-github that splits large
 * GraphQL batches into smaller chunks to avoid GitHub validationTimeout.
 */
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const DataLoader = require('dataloader')

dotenv.config()

const DEFAULT_BATCH_SIZE = 25
const validRepoNameRegex = /^[\w.-]+\/[\w.-]+$/

function getGraphqlUrl() {
  return process.env.GITHUB_GRAPHQL_URL || 'https://api.github.com/graphql'
}

function getGithubWebBase() {
  const server = process.env.GITHUB_SERVER_URL || 'https://github.com'
  return server.replace(/\/$/, '')
}

function chunk(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

function makeQuery(repos) {
  return `
      query {
        ${Object.keys(repos)
          .map(
            (repo, i) =>
              `a${i}: repository(
            owner: ${JSON.stringify(repo.split('/')[0])}
            name: ${JSON.stringify(repo.split('/')[1])}
          ) {
            ${repos[repo]
              .map((data) =>
                data.kind === 'commit'
                  ? `a${data.commit}: object(expression: ${JSON.stringify(
                      data.commit
                    )}) {
            ... on Commit {
            commitUrl
            associatedPullRequests(first: 50) {
              nodes {
                number
                url
                mergedAt
                author {
                  login
                  url
                }
              }
            }
            author {
              user {
                login
                url
              }
            }
          }}`
                  : `pr__${data.pull}: pullRequest(number: ${data.pull}) {
                    url
                    author {
                      login
                      url
                    }
                    mergeCommit {
                      commitUrl
                      abbreviatedOid
                    }
                  }`
              )
              .join('\n')}
          }`
          )
          .join('\n')}
        }
    `
}

async function fetchGithubChunk(repos) {
  const data = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query: makeQuery(repos) }),
  }).then((x) => x.json())

  if (data.errors) {
    throw new Error(
      `An error occurred when fetching data from GitHub\n${JSON.stringify(
        data.errors,
        null,
        2
      )}`
    )
  }

  if (!data.data) {
    throw new Error(
      `An error occurred when fetching data from GitHub\n${JSON.stringify(data)}`
    )
  }

  return data.data
}

function parseGithubResponse(repos, data) {
  const cleanedData = {}

  Object.keys(repos).forEach((repo, index) => {
    const output = { commit: {}, pull: {} }
    cleanedData[repo] = output
    const repoData = data[`a${index}`]
    if (!repoData) return

    Object.entries(repoData).forEach(([field, value]) => {
      if (field[0] === 'a') {
        output.commit[field.substring(1)] = value
      } else {
        output.pull[field.replace('pr__', '')] = value
      }
    })
  })

  return cleanedData
}

function getBatchSize() {
  const fromEnv = process.env.CHANGESET_GITHUB_BATCH_SIZE
  if (fromEnv) {
    const n = Number(fromEnv)
    if (!Number.isNaN(n) && n > 0) return n
  }
  return DEFAULT_BATCH_SIZE
}

let activeBatchSize = DEFAULT_BATCH_SIZE

const ghDataLoader = new DataLoader(
  async (requests) => {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error(
        'Please create a GitHub personal access token at https://github.com/settings/tokens/new and add it as the GITHUB_TOKEN environment variable'
      )
    }

    const batchSize = activeBatchSize
    const results = new Array(requests.length)

    const byRepo = {}
    requests.forEach((req, idx) => {
      if (!byRepo[req.repo]) byRepo[req.repo] = []
      byRepo[req.repo].push({ req, idx })
    })

    for (const [repo, entries] of Object.entries(byRepo)) {
      for (const entryChunk of chunk(entries, batchSize)) {
        const repos = { [repo]: entryChunk.map((e) => {
          const { repo: _repo, ...data } = e.req
          return data
        }) }

        const data = await fetchGithubChunk(repos)
        const cleaned = parseGithubResponse(repos, data)

        entryChunk.forEach(({ req, idx }) => {
          const key = req.kind === 'pull' ? req.pull : req.commit
          results[idx] = cleaned[repo][req.kind][key]
        })
      }
    }

    return results
  },
  {
    cacheKeyFn: (req) => JSON.stringify(req),
  }
)

async function getInfo(request) {
  if (!request.commit) {
    throw new Error('Please pass a commit SHA to getInfo')
  }

  if (!request.repo) {
    throw new Error(
      'Please pass a GitHub repository in the form of userOrOrg/repoName to getInfo'
    )
  }

  if (!validRepoNameRegex.test(request.repo)) {
    throw new Error(
      `Please pass a valid GitHub repository in the form of userOrOrg/repoName to getInfo (it has to match the "${validRepoNameRegex.source}" pattern)`
    )
  }

  const data = await ghDataLoader.load({ kind: 'commit', ...request })

  let user = null
  if (data.author && data.author.user) {
    user = data.author.user
  }

  let associatedPullRequest =
    data.associatedPullRequests &&
    data.associatedPullRequests.nodes &&
    data.associatedPullRequests.nodes.length
      ? data.associatedPullRequests.nodes.sort((a, b) => {
          if (a.mergedAt === null && b.mergedAt === null) return 0
          if (a.mergedAt === null) return 1
          if (b.mergedAt === null) return -1
          a = new Date(a.mergedAt)
          b = new Date(b.mergedAt)
          return a > b ? 1 : a < b ? -1 : 0
        })[0]
      : null

  if (associatedPullRequest) {
    user = associatedPullRequest.author
  }

  return {
    user: user ? user.login : null,
    pull: associatedPullRequest ? associatedPullRequest.number : null,
    links: {
      commit: `[\`${request.commit}\`](${data.commitUrl})`,
      pull: associatedPullRequest
        ? `[#${associatedPullRequest.number}](${associatedPullRequest.url})`
        : null,
      user: user ? `[@${user.login}](${user.url})` : null,
    },
  }
}

async function getInfoFromPullRequest(request) {
  if (request.pull === undefined) {
    throw new Error('Please pass a pull request number')
  }

  if (!request.repo) {
    throw new Error(
      'Please pass a GitHub repository in the form of userOrOrg/repoName to getInfo'
    )
  }

  if (!validRepoNameRegex.test(request.repo)) {
    throw new Error(
      `Please pass a valid GitHub repository in the form of userOrOrg/repoName to getInfo (it has to match the "${validRepoNameRegex.source}" pattern)`
    )
  }

  const data = await ghDataLoader.load({ kind: 'pull', ...request })
  const user = data?.author
  const commit = data?.mergeCommit
  const webBase = getGithubWebBase()

  return {
    user: user ? user.login : null,
    commit: commit ? commit.abbreviatedOid : null,
    links: {
      commit: commit
        ? `[\`${commit.abbreviatedOid}\`](${commit.commitUrl})`
        : null,
      pull: `[#${request.pull}](${webBase}/${request.repo}/pull/${request.pull})`,
      user: user ? `[@${user.login}](${user.url})` : null,
    },
  }
}

function parseSummary(summary) {
  let prFromSummary
  let commitFromSummary
  const usersFromSummary = []

  const replacedChangelog = summary
    .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
      const num = Number(pr)
      if (!isNaN(num)) prFromSummary = num
      return ''
    })
    .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
      commitFromSummary = commit
      return ''
    })
    .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
      usersFromSummary.push(user)
      return ''
    })
    .trim()

  return { prFromSummary, commitFromSummary, usersFromSummary, replacedChangelog }
}

async function resolveLinks(changeset, options) {
  const { prFromSummary, commitFromSummary, usersFromSummary, replacedChangelog } =
    parseSummary(changeset.summary)

  const webBase = getGithubWebBase()

  const links = await (async () => {
    if (prFromSummary !== undefined) {
      let { links: resolved } = await getInfoFromPullRequest({
        repo: options.repo,
        pull: prFromSummary,
      })

      if (commitFromSummary) {
        resolved = {
          ...resolved,
          commit: `[\`${commitFromSummary}\`](${webBase}/${options.repo}/commit/${commitFromSummary})`,
        }
      }

      return resolved
    }

    const commitToFetchFrom = commitFromSummary || changeset.commit

    if (commitToFetchFrom) {
      const { links: resolved } = await getInfo({
        repo: options.repo,
        commit: commitToFetchFrom,
      })
      return resolved
    }

    return { commit: null, pull: null, user: null }
  })()

  return { links, usersFromSummary, replacedChangelog }
}

function formatReleaseLine(links, usersFromSummary, replacedChangelog) {
  const [firstLine, ...futureLines] = replacedChangelog
    .split('\n')
    .map((l) => l.trimRight())

  const webBase = getGithubWebBase()
  const users = usersFromSummary.length
    ? usersFromSummary
        .map((u) => `[@${u}](${webBase}/${u})`)
        .join(', ')
    : links.user

  const prefix = [
    links.pull === null ? '' : ` ${links.pull}`,
    links.commit === null ? '' : ` ${links.commit}`,
    users === null ? '' : ` Thanks ${users}!`,
  ].join('')

  return `\n\n-${prefix ? `${prefix} -` : ''} ${firstLine}\n${futureLines
    .map((l) => `  ${l}`)
    .join('\n')}`
}

const changelogFunctions = {
  getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["./scripts/changelog-github-batched.js", { "repo": "org/repo" }]'
      )
    }

    activeBatchSize =
      typeof options.batchSize === 'number' && options.batchSize > 0
        ? options.batchSize
        : getBatchSize()

    if (dependenciesUpdated.length === 0) return ''

    const changesetLink = `- Updated dependencies [${(
      await Promise.all(
        changesets.map(async (cs) => {
          if (cs.commit) {
            const { links } = await getInfo({
              repo: options.repo,
              commit: cs.commit,
            })
            return links.commit
          }
        })
      )
    )
      .filter(Boolean)
      .join(', ')}]:`

    const updatedDepenenciesList = dependenciesUpdated.map(
      (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
    )

    return [changesetLink, ...updatedDepenenciesList].join('\n')
  },

  getReleaseLine: async (changeset, _type, options) => {
    if (!options || !options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["./scripts/changelog-github-batched.js", { "repo": "org/repo" }]'
      )
    }

    activeBatchSize =
      typeof options.batchSize === 'number' && options.batchSize > 0
        ? options.batchSize
        : getBatchSize()

    const { links, usersFromSummary, replacedChangelog } = await resolveLinks(
      changeset,
      options
    )

    return formatReleaseLine(links, usersFromSummary, replacedChangelog)
  },
}

module.exports = changelogFunctions
