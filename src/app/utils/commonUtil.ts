export const isServer = () => {
  return typeof window === 'undefined'
}
/**
 *
 * @param phoneNum 电话号码
 * @returns boolean
 */
export function validatePhone(phoneNum): boolean {
  //  /^1[3456789]\d{9}/.test(18482132951)
  return /^1[3456789]\d{9}/.test(phoneNum)
}

/**
 * 身份证有效性校验
 *  */
export function validateIdCard(idCard) {
  var vcity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  }
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
  if (!reg.test(idCard)) {
    return false
  }
  //检查省份
  var provinceCode = idCard.substring(0, 2)
  if (vcity[provinceCode] == undefined) return false
  //检验位的检测
  return checkParity(idCard) != false
}

/**
 * 校验位的检测
 * @param card
 * @returns {boolean}
 */
function checkParity(card) {
  //15位转18位
  card = changeFifteenToEighteen(card)
  var len = card.length
  if (len == 18) {
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    var sum = 0,
      i
    for (i = 0; i < 17; i++) {
      sum += card.charAt(i) * arrInt[i]
    }
    var checkCode = arrCh[sum % 11]
    return checkCode == card.substring(17).toLocaleUpperCase()
  }
  return false
}

function changeFifteenToEighteen(card) {
  if (card.length == 15) {
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    var sum = 0,
      i
    card = card.substring(0, 6) + '19' + card.substring(6)
    for (i = 0; i < 17; i++) {
      sum += card.charAt(i) * arrInt[i]
    }
    var checkCode = arrCh[sum % 11]
    return card + checkCode
  }
  return card
}

// console.log(validateIdCard('511324199406070011'))
// console.log(validateIdCard('510922199308285216'))
