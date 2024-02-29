document.getElementById('queryScore-button').addEventListener('click', function () {
    // 获取选中的科目类型
    var subjectType = document.getElementById('subjectType').value;
    // 创建 FormData 对象以构建 POST 请求的数据
    var data = toSnakeCase({queryType: subjectType})
    // 发送 POST 请求到后端登录接口
    fetch(window.targetHost + '/queryscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // 确保设置了正确的内容类型
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.hasOwnProperty('msg') && data.msg === '登陆过期') {
                showError('请刷新页面，重新登录')
            } else if (data.hasOwnProperty('msg')) {
                showError(data.msg)
            } else {

                var res = toCamelCase(data)
                var professionalCourse1Name = document.getElementById('professionalCourse1Name');
                var professionalCourse2Name = document.getElementById('professionalCourse2Name');
                var subjectTypeMap = {
                    '1': '总分',
                    '2': '政治',
                    '3': '英语',
                    '4': professionalCourse1Name.textContent,
                    '5': professionalCourse2Name.textContent,
                };

                var rankTitle = document.getElementById('rankTitle');
                if (rankTitle) {
                    rankTitle.textContent = subjectTypeMap[subjectType] + "排名";
                }
                var scoreStatisticTitle = document.getElementById('scoreStatisticTitle');
                if (scoreStatisticTitle) {
                    scoreStatisticTitle.textContent = subjectTypeMap[subjectType] + "分数段统计";
                }

                var rankInfo = document.getElementById('rankInfo');
                if (rankInfo) {
                    rankInfo.textContent = "在$number$位录分考生中，你的$subject$分数为$score$，排名为"
                        .replace('$score$', res.score)
                        .replace('$number$', res.scores.length - 2)
                        .replace('$subject$', subjectTypeMap[subjectType]);
                    var boldText = document.createElement('b');
                    boldText.textContent = res.rank;
                    rankInfo.appendChild(boldText);
                }
                // 分数表
                var table = document.getElementById('scoreTable');
                // 从最后一行开始删除，直到只剩下头部（通常是第一行）
                while (table.rows.length > 1) {
                    table.deleteRow(1);
                }
                res.scores[res.scores.length - 2].rank = '均分'
                res.scores[res.scores.length - 1].rank = '过线均分'
                // 遍历数组并添加数据到表格中
                res.scores.forEach(function (obj) {
                    var row = document.createElement('tr'); // 创建一个新行
                    if (obj.politics === null) {
                        // 表示录取分数线还没出
                        return
                    }
                    // 为每个字段创建一个单元格并添加到行中
                    Object.keys(obj).forEach(function (key) {
                        var cell = document.createElement('td'); // 创建一个新单元格
                        cell.textContent = obj[key]; // 设置单元格文本
                        row.appendChild(cell); // 将单元格添加到行中
                    });

                    table.appendChild(row); // 将行添加到表格中
                });

                // 柱状图
                var xArray = ["x"]
                var cntArray = ["各分数段人数"]
                for (let i = 0; i < res.columnCharts.length; i++) {
                    var columnChart = res.columnCharts[i]
                    var minScore = columnChart.min;
                    var maxScore = columnChart.max;
                    if (maxScore === minScore) {
                        xArray.push(minScore)
                    } else {
                        xArray.push(minScore + '-' + maxScore)
                    }

                    var count = columnChart.count;
                    cntArray.push(count)
                }
                generateColumnChart(xArray, cntArray, cntArray[0])

                if (subjectType === '1') {
                    return
                }

                // 其他列颜色变淡
                var columnIndexToExclude = Number(subjectType) - 1; // 408所在的列的索引

                // 遍历每一行
                for (let j = 1; j < table.rows[0].cells.length; j++) {
                    table.rows[0].cells[j].style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                }

                for (var i = 1; i < table.rows.length; i++) {
                    // 遍历每一个单元格
                    for (var j = 0; j < table.rows[i].cells.length; j++) {
                        // 如果不是408所在的列
                        if (j !== columnIndexToExclude && j !== 0) {
                            // 改变单元格的背景颜色
                            table.rows[i].cells[j].style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // 这里使用了一个半透明的黑色作为示例
                        }
                    }
                }


            }

        })
        .catch((error) => {
            showError(error)
        });
});

