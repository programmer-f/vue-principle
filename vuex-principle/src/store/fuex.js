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

class Store {
  constructor(options) {
    //将传递进来的state放到Store上
    this.state = options.state;
    //拿到传递进来的getters
    let getters = options.getters || {};
    //在Store上添加一个getters属性
    this.getters = {};
    //将执行后的值添加到this.getters上
    for (let key in getters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        },
      });
    }
  }
}

export default {
  install,
  Store,
};
