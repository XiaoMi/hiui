> 生成日历数据

## 操作步骤

1. 每年执行一次即可，修改 ./index.js generateDataJson 中的 length，例如今年是 2024 年：
   ```
    generateDataJson(Array.from({ length: 10 }, (v, k) => k + 2015))
   ```

2. 在 calendar-data 目录下执行

    ```bash
    node ./index.js
    ```

3. 将生成的 PRCLunar.json 和 PRCHoliday.json 上传到 CDN
