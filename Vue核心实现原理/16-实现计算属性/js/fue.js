let CompilerUtil = {
  getValue(vm,value){
    return value.split('.').reduce((data,currentKey)=>{
      return data[currentKey.trim()];
    },vm.$data);
  },
  setValue(vm,attr,newValue){
    console.log('newValue',newValue);
    attr.split('.').reduce((data,currentAttr,index,arr)=>{
      if(index === arr.length - 1){
        data[currentAttr] = newValue;
      }
      return data[currentAttr];
    },vm.$data);
  },
  getContent(vm,value){
    // console.log(value);// {{name}}-{{age}} fjp-{{age}} fjp-23
    let reg = /\{\{(.+?)\}\}/gi;
    let val = value.replace(reg,(...args)=>{
      //第一次执行 args[1] = name
      //第二次执行 args[1] = age
      return this.getValue(vm,args[1]);
    });
    return val;
  },
  model(node,value,vm){
    //在第一次渲染的时候就给所有的属性添加观察者
    new Watcher(vm,value,(newValue,oldValue)=>{
      //更新UI
      node.value = newValue;
      // debugger;
    })
    // v-model只用在input、textarea这些元素上，直接给节点的value赋值
    let val = this.getValue(vm,value);
    node.value = val;

    //界面驱动数据更新
    node.addEventListener('input',(e)=>{
      console.log(e.target.value);
      let newValue = e.target.value;
      this.setValue(vm,value,newValue);
    })
  },
  html(node,value,vm){
    new Watcher(vm,value,(newValue,oldValue)=>{
      node.innerHTML = newValue;
    });
    let val = this.getValue(vm,value);
    node.innerHTML = val;
  },
  text(node,value,vm){
    new Watcher(vm,value,(newValue,oldValue)=>{
      node.innerText = newValue;
    });
    let val = this.getValue(vm,value);
    node.innerText = val;
  },
  content(node,value,vm){
    let reg = /\{\{(.+?)\}\}/gi;
    let val = value.replace(reg,(...args)=>{
      new Watcher(vm,args[1],(newValue,oldValue)=>{
        node.textContent = this.getContent(vm,value);
      });
      return this.getValue(vm,args[1]);
    });
    node.textContent = val;
  },
  on(node,value,vm,type){
    node.addEventListener(type,(e)=>{
      vm.$methods[value].call(vm,e);
    })
  }
}

class Fue{
  constructor(options){
    //1.将传递过来的el和data保存在实例上
    if(this.isElement(options.el)){
      this.$el = options.el;
    }else{
      this.$el = document.querySelector(options.el);
    }
    this.$data = options.data;
    //将数据都添加到this上
    this.proxyData();
    this.$methods = options.methods;
    //将方法添加到this上
    this.proxyMethod();

    //将computed中的方法添加到$data中，只有这样将来在渲染的时候才能从$data中获取到computed中定义的计算属性
    this.$computed = options.computed;
    this.computed2data();
    this.proxyComputed();

    //2.根据控制区域和数据去编译渲染内容
    if(this.$el){
      //给所以的数据添加get set方法
      new Observer(this.$data);
      //编译模板内容
      new Compiler(this);
    }
  }

  proxyData(){
    for(let key in this.$data){
      Object.defineProperty(this,key,{
        get:()=>{
          return this.$data[key];
        }
      })
    }
  }

  computed2data(){
    for(let key in this.$computed){
      Object.defineProperty(this.$data,key,{
        get:()=>{
          return this.$computed[key].call(this);//将this传递过去，因为计算属性里面会用到this
        }
      })
    }
  }

  proxyComputed(){
    for(let key in this.$computed){
      Object.defineProperty(this,key,{
        get:()=>{
          return this.$computed[key].call(this);
        }
      })
    }
  }

  proxyMethod(){
    for(let key in this.$methods){
      Object.defineProperty(this,key,{
        get:()=>{
          return this.$methods[key];
        }
      })
    }
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
    //3.将渲染好的内容重新渲染到页面上
    this.vm.$el.appendChild(fragment);
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
      let {name,value} = attr;// v-on:click = "handleClick"
      let [directiveName,directiveType] = name.split(':');
      let [] = name;
      if(name.startsWith('v-')){
        let [ ,directive] = directiveName.split('-');
        CompilerUtil[directive](node,value,this.vm,directiveType);// 替换哪个节点的哪个属性，将数据传过去
      }
    })
  }

  buildText(node){
    let content = node.textContent;
    let reg = /\{\{.+?\}\}/gi;
    if(reg.test(content)){
      CompilerUtil['content'](node,content,this.vm);
    }
  }

}

class Observer {
  constructor(obj) {
    this.observe(obj);
  }

  observe(obj) {
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        this.defineReactive(obj, key, obj[key]);
      }
    }
  }

  defineReactive(obj, attr, value) {
    //如果属性的取值又是一个对象，也需要给这个对象的属性添加get set方法
    this.observe(value);
    //第三步：将当前属性的宿友观察者对象都放到当前属性的发布订阅对象中管理起来
    let dep = new Dep();//创建属于当前属性的发布订阅对象
    Object.defineProperty(obj, attr, {
      get() {
        Dep.target && dep.addSub(Dep.target);
        // debugger;
        return value;
      },
      set: (newValue) => {
        if (newValue !== value) {
          this.observe(newValue);
          value = newValue;
          //属性值变化之后就去notify
          dep.notify();
          console.log('监听到数据变化，需要去更新UI');
        }
      },
    });
  }
}


//要实现数据变化之后更新UI界面，我们可以使用发布订阅模式来实现
//先定义一个观察者类，再定义一个发布订阅类，然后再通过发布订阅的类来管理观察者类

class Dep{
  constructor(){
    //管理所有的观察者对象的
    this.subs = [];
  }

  //添加订阅
  addSub(watcher){
    this.subs.push(watcher);
  }
  //发布订阅（更新）
  notify(){
    this.subs.forEach(watcher => watcher.update());
  }
}

class Watcher{
  constructor(vm,attr,cb){
    this.vm = vm;
    this.attr = attr;
    this.cb = cb;
    //在创建观察者对象时去获取旧的值
    this.oldValue = this.getOldValue();
  }

  getOldValue(){
    Dep.target = this;
    let oldValue = CompilerUtil.getValue(this.vm,this.attr);
    Dep.target = null;
    return oldValue;
  }

  update(){
    let newValue = CompilerUtil.getValue(this.vm,this.attr);
    if(newValue !== this.oldValue){
      this.cb(newValue,this.oldValue);
    }
  }
}