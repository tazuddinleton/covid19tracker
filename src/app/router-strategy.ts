import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class RouterStrategy implements RouteReuseStrategy{

  private handlers:Map<string, DetachedRouteHandle> = new Map();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig;
  }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if(handle){
      this.handlers.set(this.getKey(route), handle);
    }
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !! this.handlers.get(this.getKey(route));
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {

    if (!route.routeConfig){
      return null;
    }
    console.log(this.handlers.get(this.getKey(route)));
    return this.handlers.get(this.getKey(route));

  }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }


  private getKey(route: ActivatedRouteSnapshot):string {
    console.log('key: ', route.routeConfig.path || "home")
    return route.routeConfig.path || "home";
  }
}
