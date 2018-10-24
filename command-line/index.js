#!/usr/bin/env node

const program = require('commander')
const shelljs = require('shelljs')
const inquirer = require('inquirer')
const opn = require('opn')
const path = require('path')
const fs = require('fs')
function create () {
  inquirer
    .prompt({
      type: 'list',
      name: 'type',
      message: 'Single or multi?',
      choices: [
        'Single page',
        'Multi page'
      ]
    })
    .then(answers => {
      const templateDir = path.join(__dirname, 'template')
      switch (answers.type) {
        case 'Single page':
          const singleDir = path.join(templateDir, 'single')
          inquirer
            .prompt({
              type: 'list',
              name: 'theme',
              message: 'What`s kind of theme?',
              choices: fs.readdirSync(singleDir)
            })
            .then(answers => {
              const themeDir = path.join(singleDir, answers.theme)
              inquirer
                .prompt({
                  type: 'input',
                  name: 'name',
                  message: 'What`s your project name?'
                })
                .then(answers => {
                  shelljs.cp('-R', themeDir, path.join(process.cwd(), answers.name))
                })
            })
          break
        default:
          console.warn('正在开发中...')
          break
      }
    })
}

function main () {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        'Init project',
        'Doc'
      ]
    })
    .then(answers => {
      switch (answers.action) {
        case 'Doc':
          opn('http://hiui-v2.fe.team/#/zh-CN/quick-start')
          break
        default:
          create()
          break
      }
    })
}

main()
program.parse(process.argv)
