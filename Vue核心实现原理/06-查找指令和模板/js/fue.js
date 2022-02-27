

class Fue{
  constructor(options){
    //1.将传递过来的el和data保存在实例上
    if(this.isElement(options.el)){
      this.$el = options.el;
    }else{
      this.$el = document.querySelector(options.el);
    }
    this.$data = options.data;

    //2.根据控制区域和数据去编译渲染内容
    new Compiler(this);
  }

  isElement(node){
    return node.nodeType === 1;//是元素
  }
}


class Compiler{
  constructor(vm){
    this.vm = vm;
    //1.将控制区域的节点都提取到内存中
    let fragment = this.node2Fragment(this.vm.$el);
    //2.利用指定的数据编译内存中的元素
    this.buildTemplate(fragment);
    
  }

  node2Fragment(app){
    let fragment = document.createDocumentFragment();
    let node = app.firstChild;
    while(node){
      fragment.appendChild(node);
      node = app.firstChild;
    }
    return fragment;
  }

  buildTemplate(fragment){
    let nodeList = [...fragment.childNodes];
    nodeList.forEach(node => {
      //判断是不是元素
      //如果是元素，我们需要判断有没有v-model
      //如果是文本，我们需要判断有没有{{}}的内容
      if(this.vm.isElement(node)){
        this.buildElement(node);
        //处理子元素
        this.buildTemplate(node);
      }else{
        this.buildText(node);
      }
    })
  }
  buildElement(node){
    let attrs = [...node.attributes];
    attrs.forEach(attr => {
      let {name,value} = attr;
      if(name.startsWith('v-')){
        console.log('是指令需要处理',name);
      }
    })
  }

  buildText(node){
    let content = node.textContent;
    let reg = /\{\{.+?\}\}/gi;
    if(reg.test(content)){
      console.log('是{{}}',content);
    }
  }

}