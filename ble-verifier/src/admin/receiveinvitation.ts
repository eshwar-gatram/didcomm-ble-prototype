import { AdminRoute } from "./route";
import { TestLogger } from '../utils/logger'
import type { Express, Request, Response } from 'express';
import { Agent, ConnectionInvitationMessage } from "@aries-framework/core";


export class AdminReceiveInvitation implements AdminRoute {
  private agent: Agent
  private logger: TestLogger

  constructor(logger: TestLogger, agent: Agent) {
    this.agent = agent
    this.logger = logger
  }

  register(express: Express) {
    this.logger.debug('registering route for connection invitations')

    express.post('/invitation', (req: Request, res: Response) => {
      this.logger.debug('Got connection invitation')
      const invitation = req.body
      const connectionRecord = this.agent.connections.receiveInvitation(invitation)
      connectionRecord.then(record => {
        this.logger.debug('Connection invitation accepted')
        res.status(200).send('Invitation accepted')
      }).catch(record => {
        this.logger.error('Connection invitation invalid: ', record)
        res.status(400).send('Invalid invitation')
      })
    })

    express.post('/invitationurl', (req: Request, res: Response) => {
      this.logger.debug('Got connection invitation url: ', req.body)
      const invitation = ConnectionInvitationMessage.fromUrl(req.body.url)
      invitation.then(invitation => {
        const connectionRecord = this.agent.connections.receiveInvitation(invitation)
        connectionRecord.then(record => {
          this.logger.debug('Connection invitation accepted')
          res.status(200).send('Invitation accepted')
        }).catch(record => {
          this.logger.error('Connection invitation invalid: ', record)
          res.status(400).send('Invalid invitation')
        })
      })
    })
  }
}
