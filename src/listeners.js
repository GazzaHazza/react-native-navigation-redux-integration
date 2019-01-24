import {rootSet, screenDisappeared, componentPushed, tabChanged} from './actions';
import {processRoot, processLayout} from './helpers';

let commandListener = null;
let navigationButtonEventListener = null;
let bottomTabEventListener = null;

const subscribeCommandListener = (navigator, store) => {
  commandListener = navigator
    .events()
    .registerCommandListener((name, params) => {
      switch (name) {
        case 'setRoot':
          {
            const initState = processRoot(params.layout);
            return store.dispatch(rootSet(initState))
          }
        case 'push':
          const componentId = params.componentId;
          const layout = processLayout(params.layout);
          return store.dispatch(componentPushed({componentId, layout}));
        default:
          return;
      }
    })
};

const subscribeToBottomTabEvent = (navigator, store) => {
  bottomTabEventListener = navigator
    .events()
    .registerBottomTabSelectedListener((params) => {
      store.dispatch(tabChanged(params));
    })
}

const subscribeToScreenDisappear = (navigator, store) => {
  screenDisappearEventListener = navigator
    .events()
    .registerComponentDidDisappearListener(({componentId}) => {
      store.dispatch(screenDisappeared({componentId}));
    })
}

export const subscribeToEvents = (navigator, store) => {
  subscribeCommandListener(navigator, store);
  subscribeToBottomTabEvent(navigator, store);
  subscribeToScreenDisappear(navigator, store);
}

export const unsubscribe = () => {
  commandListener && commandListener.remove();
  navigationButtonEventListener && navigationButtonEventListener.remove();
  bottomTabEventListener && bottomTabEventListener.remove();
}