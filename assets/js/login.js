// window.targetHost = "http://127.0.0.1:8080";
window.targetHost = "http://47.115.224.179:8080";

// 检查登陆状态
function checkState() {
    // 使用 fetch API 发送 GET 请求
    fetch(window.targetHost + '/checkstate', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {
            return response.json(); // 将响应体转换为 JSON
        })
        .then(data => {
            var loginContainer = document.querySelector('.login-container');
            if (data.hasOwnProperty('msg') && data.msg === '登陆过期') {
                // 显示登陆框
                loginContainer.style.display = 'inline-block';
                getApplyingMajor()
                var applyingMajorName = document.getElementById('applyingMajorName');
                if (applyingMajorName) {
                    applyingMajorName.textContent = "登录后，即可查看以下信息";
                }
            } else if (data.hasOwnProperty('msg')) {
                loginContainer.style.display = 'inline-block';
                showError(data.msg)
                getApplyingMajor()
                var applyingMajorName = document.getElementById('applyingMajorName');
                if (applyingMajorName) {
                    applyingMajorName.textContent = "登录后，即可查看以下信息";
                }
            } else {
                // ck没过期，隐藏登陆框
                // 登陆成功
                // 隐藏

                // showSuccess("已登录，请下拉查看录分情况")
                // 登录成功后的处理
                afterLogin(data)
            }

            // document.getElementById('data').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            // 处理错误情况
            showError(error)
        });
}

function login() {
    var loginButton = document.getElementById('login-button');
    // 锁定登录按钮并更改文字
    loginButton.disabled = true;
    loginButton.textContent = '登录中...';


    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var applyingMajorId = document.getElementById('applyingMajorId').value;

    // 创建 FormData 对象以构建 POST 请求的数据
    var data = {username: username, password: password, applyingMajorId: applyingMajorId};
    data = toSnakeCase(data)
    // 发送 POST 请求到后端登录接口
    fetch(window.targetHost + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // 确保设置了正确的内容类型
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
        .then(response => {
            loginButton.disabled = false;
            loginButton.textContent = '登录';
            return response.json()
        })
        .then(data => {
            if (data.hasOwnProperty('msg') && data.msg === '登陆过期') {
                // 弹出登陆框

            } else if (data.hasOwnProperty('msg')) {
                showError(data.msg)
            } else {
                showSuccess("登录成功，请下拉查看录分信息")
                // 登陆成功
                var loginContainer = document.querySelector('.login-container');
                // 隐藏
                loginContainer.style.display = 'none';
                // 登录成功后的处理
                afterLogin(data)
            }

        })
        .catch((error) => {
            loginButton.disabled = false;
            loginButton.textContent = '登录';

            showError(error)
        });
}

/**
 * 登陆后操作
 * @param data
 */
function afterLogin(data) {

    var res = toCamelCase(data)
    // 显示报考院系
    var applyingMajorName = document.getElementById('applyingMajorName');
    if (applyingMajorName) {
        applyingMajorName.textContent = "你报考的院系-专业：" + res.applyingMajorName;
    }
    // 科目
    var rankTitle = document.getElementById('rankTitle');
    if (rankTitle) {
        rankTitle.textContent = "总分" + rankTitle.textContent;
    }
    var scoreStatisticTitle = document.getElementById('scoreStatisticTitle');
    if (scoreStatisticTitle) {
        scoreStatisticTitle.textContent = "总分" + scoreStatisticTitle.textContent;
    }
    var professionalCourse1Rank = document.getElementById('professionalCourse1Rank');
    var professionalCourse2Rank = document.getElementById('professionalCourse2Rank');
    if (professionalCourse1Rank) {
        professionalCourse1Rank.textContent = professionalCourse1Rank.textContent
            .replace('专业课1', res.professionalCourse1Name);
    }
    if (professionalCourse2Rank) {
        professionalCourse2Rank.textContent = professionalCourse2Rank.textContent
            .replace('专业课2', res.professionalCourse2Name);
    }


    // 专业课名字
    var professionalCourse1Name = document.getElementById('professionalCourse1Name');
    var professionalCourse2Name = document.getElementById('professionalCourse2Name');
    if (professionalCourse1Name) {
        professionalCourse1Name.textContent = res.professionalCourse1Name;
    }
    if (professionalCourse2Name) {
        professionalCourse2Name.textContent = res.professionalCourse2Name;
    }
    // 排名
    var rankInfo = document.getElementById('rankInfo');
    if (rankInfo) {
        rankInfo.textContent = "在$number$位录分考生中，你的$subject$分数为$score$，排名为"
            .replace('$score$', res.score)
            .replace('$number$', res.scores.length - 2)
            .replace('$subject$', "总分");
        var boldText = document.createElement('b');
        boldText.textContent = res.rank;
        rankInfo.appendChild(boldText);
    }
    // 分数表
    var table = document.getElementById('scoreTable');
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

    var xYearArray = ["x1"]
    var scoreArray = ["录取分数"]
    for (let i = 0; i < res.lineCharts.length; i++) {
        var lineChart = toCamelCase(res.lineCharts[i])
        xYearArray.push(lineChart.year)
        scoreArray.push(lineChart.minScore)
    }

    // 折线图
    var chart = bb.generate({
        data: {
            xs: {
                录取分数: "x1",
            },
            columns: [
                xYearArray,
                scoreArray
            ],
            type: "line", // for ESM specify as: line(),
            colors: {
                录取分数: "#0066CC",
            },
            labels: {
                colors: function(color, d) { return "black"; }
            }
        },
        axis: {
            x: {
                type: "category"
            }
        },
        bindto: "#scoreLineChart"
    });
}

/**
 * 生成柱状图
 * @param xArray
 * @param cntArray
 */
function generateColumnChart(xArray, cntArray) {
    var chart = bb.generate({

        data: {
            x: "x",
            columns: [
                xArray,
                cntArray
            ],
            type: "bar", // for ESM specify as: bar()
            colors: {
                各分数段人数: "#0066CC", // 设置"data1"的颜色为深蓝色
            },
            labels: {
                colors: function (color, d) {
                    return "black";
                }
            }
        },
        axis: {
            x: {
                type: "category",
                tick: {
                    rotate: -70,
                    multiline: false,
                    tooltip: true
                }
            }
        },

        bindto: "#scoreColumnChart"
    });
}


// 定义一个函数来发送 GET 请求
function getApplyingMajor() {
    // 使用 fetch API 发送 GET 请求
    fetch(window.targetHost + '/queryapplyingmajor', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {
            return response.json(); // 将响应体转换为 JSON
        })
        .then(data => {
            var loginContainer = document.querySelector('.login-container');
            if (data.hasOwnProperty('msg') && data.msg === '登陆过期') {

            } else if (data.hasOwnProperty('msg')) {

                showError(data.msg)
            } else {

                // 假设这是从后端返回的applying_majors数组
                var res = toCamelCase(data)

                // 获取select元素
                var selectElement = document.getElementById('applyingMajorId');

                // 遍历applying_majors数组，为每个对象创建option元素
                res.applyingMajors.forEach(function (major) {
                    major = toCamelCase(major)
                    // 创建新的option元素
                    var option = document.createElement('option');
                    // 设置option的value属性和文本内容
                    option.value = major.applyingMajorId;
                    option.textContent = major.applyingMajorName;
                    // 将option元素添加到select元素中
                    selectElement.appendChild(option);
                });

            }

            // document.getElementById('data').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            // 处理错误情况
            showError(error)
        });
}


function buttonInit() {
    document.getElementById('confirmButton').addEventListener('click', function () {
        // 关闭
        var warnBox = document.getElementById('warn-box');

        var fadeEffect = setInterval(function () {
            if (warnBox.style.opacity > 0) {
                warnBox.style.opacity -= 0.2;
            } else {
                clearInterval(fadeEffect);
                warnBox.style.left = '-50%'; // 显示错误消息框
            }
        }, 70); // 逐渐减少透明度

        login();
    });

    document.getElementById('cancelButton').addEventListener('click', function () {
        // 关闭
        var warnBox = document.getElementById('warn-box');
        var fadeEffect = setInterval(function () {
            if (warnBox.style.opacity > 0) {
                warnBox.style.opacity -= 0.2;
            } else {
                clearInterval(fadeEffect);
                warnBox.style.left = '-50%'; // 显示错误消息框
            }
        }, 70); // 逐渐减少透明度


    });

    document.getElementById('login-button').addEventListener('click', function () {
        // 检测用户名密码是否为空
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (username === null || password === null || username.trim() === "" || password.trim() === "") {
            showError("请输入用户名或密码")
            return
        }
        if (username.trim().length < 6 || password.trim().length < 6) {
            showError("用户名或密码错误")
            return
        }
        // 检测是否选中院系
        var selectElement = document.getElementById('applyingMajorId');
        // 检查是否有值被选中
        if (!selectElement.value) {
            // 显示警告消息
            showError("请选择你的报考院系")
        } else {
            // 获取select元素
            var selectedText = selectElement.options[selectElement.selectedIndex].textContent;
            showWarn("请确认你的报考院系是否为：" + selectedText + "，确认后无法修改");
        }
    });
}


// 当页面加载完成时调用函数
document.addEventListener('DOMContentLoaded', checkState);
document.addEventListener('DOMContentLoaded', buttonInit);

