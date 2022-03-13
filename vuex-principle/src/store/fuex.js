import Vue from 'vue';
const install = (Vue, options) => {
  //给每一个vue实例都添加$store属性
  //Vue中有一个mixin的方法，这个方法会在创建每一个vue实例的时候执行
  Vue.mixin({
    beforeCreate() {
      /*
      Vue在创建实例的时候会先创建父组件再创建子组件
      */
      // 创建顺序： Root -> App -> HelloWorld
      if (this.$options && this.$options.store) {
        //根组件
        this.$store = this.$options.store;
      } else {
        //后代
        this.$store = this.$parent.$store;
      }
    },
  });
};

//处理模块逻辑的类
class ModuleCollection {
  constructor(rootModule) {
    this.register([], rootModule);
  }
  register(arr, rootModule) {
    // console.log(arr); // [] [home] [account] [account, login]
    //1.按照我们需要的格式创建模块
    let module = {
      _raw: rootModule,
      _state: rootModule.state,
      _children: {},
    };
    //2.保存模块信息
    if (arr.length === 0) {
      //保存根模块
      this.root = module;
    } else {
      //保存子模块
      // this.root._children[arr[arr.length - 1]] = module;
      //获取父模块
      let parent = arr.splice(0, arr.length - 1).reduce((root, currentkey) => {
        return root._children[currentkey];
      }, this.root);
      parent._children[arr[arr.length - 1]] = module;
    }
    //3.处理子模块
    for (let childrenModuleName in rootModule.modules) {
      let childrenModule = rootModule.modules[childrenModuleName];
      this.register(arr.concat(childrenModuleName), childrenModule);
    }
  }
}

class Store {
  constructor(options) {
    //将传递进来的state放到Store上
    // this.state = options.state;
    Vue.util.defineReactive(this, 'state', options.state); //快速将某个数据变成双向绑定的数据
    //提取模块信息
    this.modules = new ModuleCollection(options);
    //安装子模块的数据
    this.initModules([], this.modules.root);
    /*
    let root = {
      _raw:rootModule,
      _state:rootModule.state,
      _children:{
        home:{
          _raw:homeModule,
          _state:homeModule.state,
          _children:{}
        },
        account:{
          _raw:accountModule,
          _state:accountModule.state,
          _children:{
            login:{
              _raw:loginModule,
              _state:loginModule.state,
              _children:{}
            }
          }
        }
      }
    }
    */
  }

  initModules(arr, rootModule) {
    // console.log(arr); //[] [home] [account] [account, login]
    //如果当前是子模块，那么就需要将数据安装到this.state上
    if (arr.length > 0) {
      let parent = arr.splice(0, arr.length - 1).reduce((state, currentKey) => {
        return state[currentKey];
      }, this.state);
      Vue.set(parent, arr[arr.length - 1], rootModule._state);
    }
    this.initGetters(rootModule._raw);
    this.initMutations(rootModule._raw);
    this.initActions(rootModule._raw);
    //如果当前不是子模块，那么就需要从根模块中取出子模块的信息来安装
    for (let childrenModuleName in rootModule._children) {
      let childrenModule = rootModule._children[childrenModuleName];
      this.initModules(arr.concat(childrenModuleName), childrenModule);
    }
  }
  initGetters(options) {
    //拿到传递进来的getters
    let getters = options.getters || {};
    //在Store上添加一个getters属性
    this.getters = this.getters || {};
    //将执行后的值添加到this.getters上
    for (let key in getters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](options.state);
        },
      });
    }
  }
  //触发mutations里面的方法
  commit = (type, payload) => {
    //为了避免找不到this，将commit方法变为箭头函数
    this.mutations[type].forEach((fn) => fn(payload)); // this.mutations[addNum](10)
  };
  initMutations(options) {
    let mutations = options.mutations || {};
    this.mutations = this.mutations || {};
    for (let key in mutations) {
      this.mutations[key] = this.mutations[key] || [];
      this.mutations[key].push((payload) => {
        mutations[key](options.state, payload);
      });
    }
  }
  dispatch(type, payload) {
    //'asyncAddAge', 5
    //为了避免找不到this，将方法变为箭头函数
    this.actions[type].forEach((fn) => fn(payload)); // this.actions['asyncAddAge'](5);
  }
  initActions(options) {
    let actions = options.actions || {};
    this.actions = this.actions || {};
    for (let key in actions) {
      this.actions[key] = this.actions[key] || [];
      this.actions[key].push((payload) => {
        actions[key](this, payload);
      });
    }
  }
}

export default {
  install,
  Store,
};
