class DanmuWrap extends HTMLElement {
  constructor () {
    super()

    const shadow = this.attachShadow({ mode: 'open' })

    const templateElem = document.getElementById('danmuWrapTpl'),
      content = templateElem.content.cloneNode(true)

    this.$wrap = content.querySelector('.wrap')
    this.$message = content.querySelector('.message')
    this.$portrait = content.querySelector('.portrait')

    // 延迟获取 ---> 因为一开始还没有渲染到上面去,而渲染UI是在setTimeout之后才执行的
    setTimeout(() => {
      this.setAttribute('width', this.$wrap.clientWidth) 
    }, 0)
    shadow.appendChild(content)
  }

  connectedCallback () {
    const message = this.getAttribute('message'),
      portrait = this.getAttribute('portrait'),
      color = this.getAttribute('color'),
      top = this.getAttribute('top'),
      posX = this.getAttribute('posx')

    this.$message.innerHTML = message
    this.$message.style.color = color
    this.$wrap.style.top = top + 'px'
    this.$wrap.style.transform = `translateX(${posX}px)`
    this.$portrait.innerHTML = `<img src=${portrait} class="img" />`
    this.setAttribute('hover', 'play')

    this.$message.addEventListener('mouseover', () => {
      this.setAttribute('hover', 'pause')
      this.$wrap.style['box-shadow'] = `${color} 0px 0px 8px`
    })

    this.$message.addEventListener('mouseleave', () => {
      this.setAttribute('hover', 'play')
      this.$wrap.style['box-shadow'] = ``
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    let hoverStatus = this.getAttribute('hover')
    if (hoverStatus === 'play') {
      this.$wrap.style.transform = `translateX(${newValue}px)`
    }
  }

  static get observedAttributes() {
    return ['posx']
  }
}

customElements.define('danmu-wrap', DanmuWrap)
