# fluid canvas
This is a collaborative editable drawing application using Fluid Framework.

[Fluid Framework](https://fluidframework.com/)

## run

```
npx tinylicious@latest

yarn start

```

### with ngrok

If you want to run it from multiple devices, see here.

https://fluidframework.com/docs/testing/tinylicious/#testing-with-tinylicious-and-multiple-clients

Set the forwarding domain displayed in Forwarding after running ngrok http to the connection domain of TinyliciousClientProps.
Use the configured TinyliciousClientProps as an argument to TinyliciousClient.

```App.tsx
const clientProps: TinyliciousClientProps = {
   connection: { port: 443, domain: "https://forwarding-domain.ngrok.io" }
}
const client = new TinyliciousClient(clientProps);
```

```sh
npx tinylicious@latest

"../ngrok" http 7070

yarn start

```