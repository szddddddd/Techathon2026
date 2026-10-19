/** Seed persisted placements through the same manager used by the placement UI.
 * Desktop worlds intentionally start without a placed kiosk or cinema.
 */
export async function seedPlacedFacilities(page) {
  await page.evaluate(async () => {
    const theme = __sceneTheme.id;
    for (const [id, group] of [['accounts', __discoveryScene.kiosk], ['videos', __discoveryScene.cinema]]) {
      if (__mods.state.buildings?.[id]?.[theme]?.length) continue;
      const {x, z} = group.position;
      await __mods.updateBuildingPositions(id, theme, () => [{id: `fixture-${theme}-${id}`, x, z, rotation: group.rotation.y}]);
      await __mods.change(id, 'enable');
    }
  });
  await page.waitForFunction(() => __discoveryScene.kiosk.visible && __discoveryScene.cinema.visible);
}
