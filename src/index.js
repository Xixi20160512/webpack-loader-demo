const vm = require('vm')

const _header = `
  // 模拟两个变量，实际上在webpack编译阶段
  // require('dva/dynamic')
  // 还是要求已经安装这个npm包的

  const dvaDynamic = () => {}
  const app = {}
  `

const funMark = '____fun'
const newLineReg = /\n\r?/g

module.exports = function (content) {
  // this 也就是webpack配置中每个loader声明对应的Object
  // 而 query 也就是该对象中的 options 属性
  const { replaceMap } = this.query
  // vm 环境中的global对象
  const sandBox = {
    module: {
      exports: {},
    },
  }
  vm.createContext(sandBox)
  vm.runInContext(content, sandBox)

  const routes = sandBox.module.exports

  replaceComponent(routes, replaceMap)

  return `
    ${_header}
    module.exports = ${removeMark(JSON.stringify(routes))}
  `
}

function replaceComponent(routes, replaceMap) {
  routes.map((route) => {
    route.component = makeComponentStr(route.component, replaceMap)
  })
}

function makeComponentStr(str, replaceMap) {
  return `${funMark}
    dvaDynamic({
      app,
      component: () => import('${replacePath(str, replaceMap)}'),
      models: []
    })
    ${funMark}`.replace(newLineReg, '')
}

function replacePath(str, replaceMap) {
  Object.keys(replaceMap).forEach((key) => {
    str = str.replace(key, replaceMap[key])
  })
  return str
}

function removeMark(str) {
  return str.replace(new RegExp(`(?:"${funMark}|${funMark}")`, 'g'), '')
}
