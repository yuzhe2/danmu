;((doc) => {
  let clientHeight, // 容器的高度
    clientWidth, // 容器的宽度
    oBox = doc.createElement('div') // 存放弹幕的容器
    oBox.style.position = 'relative'
    oBox.style.overflow = 'hidden'
  
  // 弹幕容器
  class Wrap {
    constructor (options) {
      this.el = options.el
      this.pool = options.pool || []
      this.originPool = []
      this.targetPool = this.proxyPool()
      this.init()
    }

    init () {
      this.defineBox()
      for (let i = 0; i < this.pool.length; i++) {
        this.targetPool.push(new Barrage(this.pool[i]))
      }
    }
    
    // 监听原始弹幕池的变化
    proxyPool () {
      let _self = this
      return new Proxy(this.originPool, {
        set (obj, prop, value) {
          if (prop !== 'length') _self.renderDanmu(value)
          return Reflect.set(obj, prop, value)
        }
      })
    }

    // 添加弹幕节点
    renderDanmu (danmu) {
      const danmuTpl = doc.createElement('danmu-wrap')
      danmuTpl.setAttribute('color', danmu.color)
      danmuTpl.setAttribute('message', danmu.message) 
      danmuTpl.setAttribute('portrait', danmu.portrait)
      danmuTpl.setAttribute('top', danmu.posY)
      danmuTpl.setAttribute('posx', clientWidth)
      oBox.appendChild(danmuTpl)
      // 延迟获取,因为在模板代码中是延迟获取的,所以这边也要延迟获取才能获取到正确的值
      setTimeout(() => {
        this.loop(danmuTpl, danmu.speed, clientWidth, danmuTpl.getAttribute('width'))
      })
    }

    // 弹幕的滚动
    loop (danmuTpl, speed, startX, danmuWidth) {
      let hoverStatus = danmuTpl.getAttribute('hover')
      // 判断是否处于可以滚动的状态
      if (hoverStatus === 'pause') {
        danmuTpl.setAttribute('posx', startX)
        requestAnimationFrame(this.loop.bind(this, danmuTpl, speed, startX, danmuWidth))
      } else {
        if (startX < -danmuWidth) {
          oBox.removeChild(danmuTpl)
          return
        }
        danmuTpl.setAttribute('posx', startX - speed)
        requestAnimationFrame(this.loop.bind(this, danmuTpl, speed, startX - speed, danmuWidth))
      }
    }

    // 初始化容器的宽高
    defineBox () {
      const oWrap = doc.querySelector(this.el)
      clientHeight = oWrap.clientHeight
      clientWidth = oWrap.clientWidth
      oBox.style.height = `${clientHeight}px`
      oWrap.appendChild(oBox)
    }

    // 添加弹幕
    pushPool (barrage) {
      this.targetPool.push(new Barrage(barrage))
    }
  }

  // 弹幕
  class Barrage {
    constructor (options) {
      this.portrait = options.portrait || './img/avatar1.jpg'
      this.message = options.message
      this.color = options.color || randomColor()
      this.speed = randomNum(2, 4)
      this.posX = 0
      this.posY = randomNum(0, clientHeight - 36)
    }
  }

  window.Wrap = Wrap
})(document)