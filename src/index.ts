import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.postmarkapp.com/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Postmark-Server-Token": `${process.env.POSTMARK_TOKEN}`,
  },
});

const app = new Elysia()
  .use(
    cron({
      name: "SendEmail",
      pattern: "* * */24 * * *",
      run() {
        console.log("Send Email");
        instance.post("email", {
          From: "uclfeedback@webdock.io",
          To: "mikehovedskov@gmail.com", //Ændre til deres mail
          Subject: "Test",
          HtmlBody: '<b>Hello</b> <img src="cid:image.jpg"/>',
          TextBody: "Hello",
          TrackOpens: true,
          TrackLinks: "None",
          MessageStream: "outbound",
        });
      },
    })
  )
  .get("/", async () => {
    const results = await instance.post("email", {
      From: "uclfeedback@webdock.io",
      To: "mikehovedskov@gmail.com", //Ændre til deres mail
      Subject: "Test",
      HtmlBody: '<b>Hello</b> <img src="cid:image.jpg"/>',
      TextBody: "Hello",
      TrackOpens: true,
      TrackLinks: "None",
      MessageStream: "outbound",
    });

    console.log("Send Email");
    console.log(results.data);

    return results.data;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
