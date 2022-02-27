

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
  }
}