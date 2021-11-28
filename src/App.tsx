import React from "react";
import SignaturePad from "react-signature-pad-wrapper"
import { TinyliciousClient, TinyliciousClientProps } from "@fluidframework/tinylicious-client";
import { SharedMap } from "fluid-framework";

const dataKey = "drawing";
const containerSchema = {
  initialObjects: { view: SharedMap }
};

const clientProps: TinyliciousClientProps = {}
// const clientProps: TinyliciousClientProps = {
//   connection: { port: 443, domain: "" }
// }
const client = new TinyliciousClient(clientProps);

const getViewData = async (): Promise<SharedMap> => {
  let container;
  const containerId = window.location.hash.substring(1);
  if (!containerId) {
    ({ container } = await client.createContainer(containerSchema));
    const id = await container.attach();
    window.location.hash = id;
  } else {
    ({ container } = await client.getContainer(containerId, containerSchema));
  }

  return container.initialObjects.view as SharedMap;
}

function App() {
  const signaturePadRef = React.useRef<SignaturePad>(null);

  const [fluidData, setFluidData] = React.useState<SharedMap>();
  React.useEffect(() => {
    getViewData().then(view => setFluidData(view));
  }, []);

  React.useEffect(() => {
    if (!fluidData) {
      return;
    }

    const syncView = () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.fromDataURL(fluidData.get(dataKey) as string);
      }
    }

    syncView();
    fluidData.on("valueChanged", syncView);
    return () => { fluidData.off("valueChanged", syncView) }
  }, [fluidData]);

  const [imageData, setImageData] = React.useState<string>();
  React.useEffect(() => {
    if (imageData) {
      fluidData?.set(dataKey, imageData);
    }
  }, [imageData, fluidData]);

  const onEnd = React.useCallback(() => {
    const signaturePad = signaturePadRef.current;
    const dataUrl = signaturePad?.toDataURL("image/svg+xml");
    setImageData(dataUrl);
  }, [setImageData]);

  return (
    <SignaturePad ref={signaturePadRef} options={{onEnd: onEnd}} />
  );
}

export default App;
