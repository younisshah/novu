# NestJS Module Wrapper

A NestJS module wrapper for [@novu/node](https://github.com/novuhq/novu)

## Usage

Initializing module with templates and providers:
```javascript
    import { NovuModule } from "@novu/nest";

    @Module({
      imports: [
        NovuModule.forRoot({
          providers: [
            new SendgridEmailProvider({
              apiKey: process.env.SENDGRID_API_KEY,
              from: 'sender@mail.com',
            }),
          ],
          templates: [
            {
              id: 'password-reset',
              messages: [
                {
                  subject: 'Your password reset request',
                  channel: ChannelTypeEnum.EMAIL,
                  template: `
                          Hi {{firstName}}!

                          To reset your password click <a href="{{resetLink}}">here.</a>
                          `,
                },
              ],
            },
          ],
        }),
      ],
    })
```

Using novu's singleton service in other services and modules:

```javascript
import { Injectable, Inject } from '@nestjs/common';
import { NovuService } from '@novu/nest';

@Injectable()
export class UserService {
  constructor(private readonly novu: NovuService) {}

  async triggerEvent() {
    await this.novu.trigger('password-reset', {
      $email: 'receiver@mail.com',
      $user_id: 'id'
    });
  }
}
```
