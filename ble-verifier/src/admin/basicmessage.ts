import { Agent } from "@aries-framework/core";
import { AdminRoute } from "./route";
import { TestLogger } from "../utils/logger";
import { Express, Request, Response } from "express";




export class AdminBasicMessage implements AdminRoute{
  private agent:Agent
  private logger:TestLogger

  constructor(logger:TestLogger,agent:Agent){
    this.agent=agent;
    this.logger=logger
  }

  register(express: Express): void {
    this.logger.debug('registering route for connection invitations')
    express.post('/basic-meassage',(req:Request,res:Response)=>{
      const{conn_id,msg}= req.body
      const basicMsg=this.agent.basicMessages.sendMessage(conn_id,msg)

      basicMsg.then(basicMsg=>{
        res.status(200).send(basicMsg)
      }).catch(err =>{
        res.status(400).send("error sending basic message: "+err)
      })
    })
  }
}