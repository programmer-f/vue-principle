//保存当前路由地址的类
class FueRouteInfo {
  constructor() {
    this.currentPath = null;
  }
}

class FueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash';
    this.routes = options.routes || [];
    //1.提取路由信息
    /*
    {
      '/home':Home,
      '/about':About
    }
    */
    this.routesMap = this.createRoutesMap();
    this.routeInfo = new FueRouteInfo();
    //2.初始化默认的路由信息
    this.initDefault();
  }

  initDefault() {
    if (this.mode === 'hash') {
      if (!location.hash) {
        location.hash = '/';
      }
      //监听hash改变
      window.addEventListener('load', () => {
        this.routeInfo.currentPath = location.hash.slice(1);
      });
      window.addEventListener('hashchange', () => {
        this.routeInfo.currentPath = location.hash.slice(1);
      });
    } else {
      if (!location.pathname) {
        location.pathname = '/';
      }
      //监听路径改变
      window.addEventListener('load', () => {
        this.routeInfo.currentPath = location.pathname;
      });
      window.addEventListener('popstate', () => {
        this.routeInfo.currentPath = location.pathname;
      });
    }
  }

  createRoutesMap() {
    return this.routes.reduce((map, route) => {
      map[route.path] = route.component;
      return map;
    }, {});
  }
}

FueRouter.install = (Vue, options) => {
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        this.$router = this.$options.router;
        this.$route = this.$router.routeInfo;
        //将数据变成双向绑定的数据
        Vue.util.defineReactive(this, 'xxx', this.$router);
      } else {
        this.$router = this.$parent.$router;
        this.$route = this.$router.routeInfo;
      }
    },
  });
  //注册全局组件router-link
  Vue.component('router-link', {
    props: {
      to: String,
    },
    render() {
      let path = this.to;
      if (this._self.$router.mode === 'hash') {
        path = '#' + path;
      }
      return <a href={path}>{this.$slots.default}</a>;
    },
  });
  //注册全局组件router-view
  //在调Vue.mixin()方法时，将this.$router的数据变成双向绑定的数据
  //Vue.util.defineReactive(this,'xxx',this.$router);
  //这样在currentPath发生变化就会重新去调用render函数
  Vue.component('router-view', {
    render(h) {
      let routesMap = this._self.$router.routesMap;
      let currentPath = this._self.$route.currentPath;
      let currentComponent = routesMap[currentPath];
      return h(currentComponent);
    },
  });
};

export default FueRouter;
