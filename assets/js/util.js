/**
 * 从蛇形命名转换为小驼峰命名
 * @param obj
 * @returns {{}}
 */
function toCamelCase(obj) {
    var newObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var camelCaseKey = key.replace(/(_[a-z])/g, (match) => match.toUpperCase().replace('_', ''));
            newObj[camelCaseKey] = obj[key];
        }
    }
    return newObj;
}


/**
 * 从小驼峰命名转换为蛇形命名
 * @param obj
 * @returns {{}}
 */
function toSnakeCase(obj) {
    var newObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            newObj[snakeCaseKey] = obj[key];
        }
    }
    return newObj;
}

