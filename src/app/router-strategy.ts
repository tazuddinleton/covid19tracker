import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class RouterStrategy implements RouteReuseStrategy{

  private handlers:Map<string, DetachedRouteHandle> = new Map();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log('in shouldDetach', !!route.routeConfig)
    return !!route.routeConfig;
  }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

    if(handle){
      this.handlers.set(this.getKey(route), handle);
    }
    console.log('in store', this.handlers)
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log('in shouldAttach', this.handlers.get(this.getKey(route)))
    return !! this.handlers.get(this.getKey(route));
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    console.log('in retrieve', this.handlers.get(this.getKey(route)))
    if (!route.routeConfig){
      return null;
    }
    return this.handlers.get(this.getKey(route));

  }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    console.log('in shouldReuseRoute', future.routeConfig === curr.routeConfig)
    return future.routeConfig === curr.routeConfig;
  }


  private getKey(route: ActivatedRouteSnapshot):string {
    console.log('getKey', route.routeConfig.path || "home");
    return route.routeConfig.path || "home";
  }
}
