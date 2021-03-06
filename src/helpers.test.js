import {
  objectClone,
  getActiveChildrens,
  pushToStack,
  popFromStack,
  popToRoot,
  popToScreen,
  changeTabIndex,
  createActiveScreenArray,
  hasComponentWithId,
  removeScreenIfNeeded,
  isComponentOfType,
  getActiveScreenOfTab,
  getActiveComponentId,
  setStackRoot,
  getSideMenuChildrenId,
  processRoot,
  changeTabIndexToComponent,
  processLayout
} from './helpers';
import {
  state,
  activeStackChildrens,
  pushedState,
  componentToPush,
  poppedState,
  poppedToRootState,
  poppedToComponentState,
  changedTabState,
  changeTabParams,
  stackToSetForRoot,
  setStackRootState
} from './testStates/bottomTabsWithStack';
import {sideMenuState, sideMenuSetStackRootState, sideMenuStackToSetForRoot, setRootPayload, processedLayout} from './testStates/sideMenuWithTabs';
import {LayoutType} from './constants';

test('Getting active stack childrens', () => {
  expect(getActiveChildrens(state.root, 'Stack5')).toEqual(activeStackChildrens)
});

describe('Pushing new component to stack', () => {
  test('with right id', () => {
    expect(pushToStack(objectClone(state.root), 'Component17', componentToPush)).toMatchObject(pushedState.root)
  });
  test('with wrong id', () => {
    expect(pushToStack(objectClone(state.root), 'Components18', componentToPush)).toMatchObject(state.root)
  });
});

describe('Popping component from stack', () => {
  test('with right id', () => {
    expect(popFromStack(objectClone(state.root), 'Component17')).toMatchObject(poppedState.root)
  });

  test('with wrong id', () => {
    expect(popFromStack(objectClone(state.root), 'Components18')).toMatchObject(state.root)
  });

  test('with in the middle component id', () => {
    expect(popFromStack(objectClone(state.root), 'Components15')).toMatchObject(state.root)
  });
});

describe('Popping stack to root', () => {
  test('with right id', () => {
    expect(popToRoot(objectClone(state.root), 'Component17')).toMatchObject(poppedToRootState.root)
  });

  test('with wrong id', () => {
    expect(popToRoot(objectClone(state.root), 'Components18')).toMatchObject(state.root)
  });
});

describe('Popping stack to component', () => {
  test('with right id', () => {
    expect(popToScreen(objectClone(state.root), 'Component11')).toMatchObject(poppedToComponentState.root)
  });

  test('with wrong id', () => {
    expect(popToScreen(objectClone(state.root), 'Components18')).toMatchObject(state.root)
  });

  test('with stack root id', () => {
    expect(popToScreen(objectClone(state.root), 'Component6')).toMatchObject(poppedToRootState.root)
  });
});

test('Changing active tab', () => {
  expect(changeTabIndex(objectClone(state.root), ...changeTabParams)).toMatchObject(changedTabState.root)
});

test('Changing active tab with merge options', () => {
  expect(changeTabIndexToComponent(objectClone(state.root), 'BottomTabs4', 1)).toMatchObject(changedTabState.root)
});

describe('Creating active screen array', () => {
  test('', () => {
    expect(createActiveScreenArray(objectClone(state.root), 'Component17')).toEqual(state.activeScreenArray)
  });

  test('', () => {
    expect(createActiveScreenArray(objectClone(pushedState.root), 'Component19')).toEqual(pushedState.activeScreenArray)
  });

  test('', () => {
    expect(createActiveScreenArray(objectClone(poppedState.root), 'Component15')).toEqual(poppedState.activeScreenArray)
  });

  test('', () => {
    expect(createActiveScreenArray(objectClone(poppedToRootState.root), 'Component6')).toEqual(poppedToRootState.activeScreenArray)
  });

  test('', () => {
    expect(createActiveScreenArray(objectClone(changedTabState.root), 'Component10')).toEqual(changedTabState.activeScreenArray)
  });
});

describe('Checking if tree has component with id', () => {
  test('', () => {
    expect(hasComponentWithId(state.root, 'Component17')).toBeTruthy();
  });

  test('', () => {
    expect(hasComponentWithId(pushedState.root, 'Component21')).toBeFalsy();
  });

  test('', () => {
    expect(hasComponentWithId(poppedState.root, 'BottomTabs4')).toBeTruthy();
  });

  test('', () => {
    expect(hasComponentWithId(poppedToRootState.root, 'Stack7')).toBeTruthy();
  });

  test('', () => {
    expect(hasComponentWithId(changedTabState.root, 'Stack21')).toBeFalsy();
  });
});

describe('Removing screen if it disappeared', () => {
  test('', () => {
    const root = objectClone(state.root);
    expect(removeScreenIfNeeded(root, root, 'Component17')).toMatchObject(poppedState.root)
  });

  test('', () => {
    const root = objectClone(pushedState.root);
    expect(removeScreenIfNeeded(root, root, 'Component19')).toMatchObject(state.root)
  });

  test('', () => {
    const root = objectClone(state.root);
    expect(removeScreenIfNeeded(root, root, 'Component10')).toMatchObject(state.root)
  });

  test('', () => {
    const root = objectClone(state.root);
    expect(removeScreenIfNeeded(root, root, 'Component15')).toMatchObject(state.root)
  });
});

describe('Testing layout types', () => {
  test('', () => {
    expect(isComponentOfType(state.root, 'Component17', LayoutType.Component)).toBeTruthy()
  });

  test('', () => {
    expect(isComponentOfType(state.root, 'Component17', LayoutType.SideMenuCenter)).toBeFalsy()
  });

  test('', () => {
    expect(isComponentOfType(state.root, 'Stack5', LayoutType.Stack)).toBeTruthy()
  });

  test('', () => {
    expect(isComponentOfType(state.root, 'BottomTabs4', LayoutType.BottomTabs)).toBeTruthy()
  });

  test('', () => {
    expect(isComponentOfType(state.root, 'BottomTabs4', LayoutType.Stack)).toBeFalsy()
  });
});

describe('Testing getting active screen of tab', () => {
  test('', () => {
    expect(getActiveScreenOfTab(state.root, 'BottomTabs4')).toBe('Component17')
  });
  test('', () => {
    expect(getActiveScreenOfTab(state.root, 'BottomTabs4', 1)).toBe('Component10')
  });
  test('', () => {
    expect(getActiveScreenOfTab(state.root, 'BottomTabs4', 2)).toBe('Component9')
  });
});

describe('Testing getting active component id', () => {
  test('with side menu layout', () => {
    expect(getActiveComponentId(sideMenuState.root)).toBe('Component21')
  });
  test('with bottom tabs layout', () => {
    expect(getActiveComponentId(state.root)).toBe('Component17')
  });
});

describe('Setting stack root', () => {
  test('with side menu layout', () => {
    const root = objectClone(sideMenuState.root);
    expect(setStackRoot(root, 'Component21', sideMenuStackToSetForRoot)).toMatchObject(sideMenuSetStackRootState.root)
  });

  test('with bottom tabs layout', () => {
    const root = objectClone(state.root);
    expect(setStackRoot(root, 'Component17', stackToSetForRoot)).toMatchObject(setStackRootState.root)
  });
});

describe('Getting side menu ', () => {
  test('left side id', () => {
    expect(getSideMenuChildrenId(sideMenuState.root, 'SideMenuRoot4', LayoutType.SideMenuLeft)).toBe('SideMenuLeft5')
  });

  test('right side id', () => {
    expect(getSideMenuChildrenId(sideMenuState.root, 'SideMenuRoot4', LayoutType.SideMenuRight)).toBe('SideMenuRight14')
  });
});

describe('Processing layout for setRoot action', () => {
  test('left side id', () => {
    const layout = processRoot(setRootPayload);
    const rootLayout = processLayout(setRootPayload.root);
    expect(layout.root).toMatchObject(processedLayout.root);
    expect(rootLayout).toMatchObject(processedLayout.root);
    expect(layout.modals).toEqual(processedLayout.modals);
    expect(layout.root).toEqual(processedLayout.root);
  });
});