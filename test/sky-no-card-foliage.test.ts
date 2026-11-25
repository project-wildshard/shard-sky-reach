// QA 2026-11-24 row 53 (J510: no flat image stands in for a 3D object): the mill's ivy is leaves and vines and the
// fir's boughs are branches with needle tufts, real geometry, not flat sheets or crossed cards.
import { expect, it } from 'vitest';
import { buildMillSet } from '../src/generators/mill';
import { buildGeometries } from '../src/generators/geometries';

it('draws the mill ivy as leaves, with no alpha-cut sheet', () => {
  const ivy = buildMillSet().find(([name]) => name === 'ivy')?.[1];
  expect(ivy).toBeDefined();
  const material = ivy?.material as { alphaTest?: number } | undefined;
  expect(material?.alphaTest ?? 0).toBe(0);
  // hundreds of small leaves, not 20 strips of 40 triangles
  expect((ivy?.geometry.getIndex()?.count ?? 0) / 3).toBeGreaterThan(4000);
  const uv = ivy?.geometry.getAttribute('uv');
  for (let i = 0; i < (uv?.count ?? 0); i++) expect([uv?.getX(i), uv?.getY(i)]).toEqual([0, 0]);
});

it('builds the fir with no texture-mapped card', () => {
  const fir = buildGeometries().find(([name]) => name === 'fir')?.[1];
  const uv = fir?.geometry.getAttribute('uv');
  expect(uv?.count ?? 0).toBeGreaterThan(1000);
  // every vertex is off the sheet: the fir is vertex-coloured geometry, nothing samples a picture
  for (let i = 0; i < (uv?.count ?? 0); i++) expect([uv?.getX(i), uv?.getY(i)]).toEqual([-1, -1]);
});
