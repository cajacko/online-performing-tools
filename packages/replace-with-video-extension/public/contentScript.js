const selectors = [
  {
    shouldRunOnPage: () =>
      window.location.href.includes("https://www.youtube.com/"),
    getElementToOverlay: () =>
      document.querySelector("#primary #player-container-outer"),
    getFeedStatus: ({
      instance,
      prevStatus,
      props: { href, prevHref },
      elementToOverlay: elem,
      setStatus: set,
      getStatus: get,
    }) => {
      const isVisible = !!(
        elem &&
        (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
      );

      if (!isVisible) return "HIDDEN";
      if (prevHref !== href) return "BLANK";
      if (prevStatus === "LOADING" || prevStatus === "FEED") return prevStatus;

      setTimeout(() => {
        if (get() === "LOADING") {
          set("FEED");
        }
      }, 2000);

      return "LOADING";
    },
  },
].map((selector) => ({ ...selector, instance: {} }));

console.log("replace-with-video-extension - init");

const video = document.createElement("video");
video.setAttribute("autoplay", true);
video.style.position = "absolute";
video.style.top = "0px";
video.style.left = "0px";
video.style.right = "0px";
video.style.bottom = "0px";
video.style.height = "100%";
video.style.width = "100%";
video.style.background = "black";

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    video.srcObject = stream;
  })
  .catch(function (err0r) {
    console.error("replace-with-video-extension - could not start feed");
  });

const loading = document.createElement("p");
loading.textContent = "Loading";
loading.style.display = "none";
loading.style.fontSize = "20px";
loading.style.color = "white";

const container = document.createElement("div");
container.appendChild(video);
container.appendChild(loading);
container.style.position = "absolute";
container.style.background = "black";
container.style.display = "none";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.zIndex = 999999999999999;

let status = "HIDDEN";
let hasInsertedContainerInDom = false;
let hasFoundElement = false;
let elementToOverlay;

function setStatus(newStatusArg) {
  if (!document.body) return;

  if (!hasInsertedContainerInDom) {
    console.log("replace-with-video-extension - insert into dom");
    document.body.appendChild(container);
    hasInsertedContainerInDom = true;
  }

  let newStatus = elementToOverlay ? newStatusArg : "HIDDEN";

  if (newStatus !== "HIDDEN") {
    const bounds = elementToOverlay.getBoundingClientRect();

    if (bounds.x && bounds.y && bounds.height && bounds.width) {
      container.style.top = bounds.y + "px";
      container.style.left = bounds.x + "px";
      container.style.height = bounds.height + "px";
      container.style.width = bounds.width + "px";
    }
  }

  if (status === newStatus) return;

  status = newStatus;

  console.log("replace-with-video-extension - change status - ", status);

  switch (status) {
    case "HIDDEN":
      container.style.display = "none";
      break;
    case "LOADING":
    case "BLANK":
    case "FEED":
      container.style.display = "flex";
      let hideVideo = true;
      let hideLoading = true;

      if (status === "LOADING") {
        hideLoading = false;
      } else if (status === "FEED") {
        hideVideo = false;
      }

      video.style.display = hideVideo ? "none" : "block";
      loading.style.display = hideLoading ? "none" : "block";

      break;
    default:
      console.error("replace-with-video-extension - invalid status");
      break;
  }
}

function getStatus() {
  return status;
}

const props = {
  prevHref: null,
  href: window.location.href,
};

setInterval(() => {
  props.prevHref = props.href;
  props.href = window.location.href;

  const selector = selectors.find(({ shouldRunOnPage, instance }) =>
    shouldRunOnPage({ props, instance, status, elementToOverlay })
  );

  if (!selector) {
    setStatus("HIDDEN");
    return;
  }

  const args = [
    {
      instance: selector.instance,
      prevStatus: status,
      elementToOverlay,
      props,
      setStatus,
      getStatus,
    },
  ];

  elementToOverlay = selector.getElementToOverlay(...args);

  if (!elementToOverlay) {
    setStatus("HIDDEN");
    return;
  }

  if (!hasFoundElement) {
    console.log("replace-with-video-extension - found element to overlay");
    hasFoundElement = true;
  }

  const newStatus = selector.getFeedStatus(...args);

  setStatus(newStatus);
});
