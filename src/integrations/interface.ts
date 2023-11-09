export interface Integration {
  authenticate(authType:string, payload:any):Promise<string | boolean> ;
  performAction(actionName: string, payload: any): Promise<any>;
}
