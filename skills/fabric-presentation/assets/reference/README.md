# Reference imagery

The donor templates carry **no logo image**: the brand mark of a Fabric deck is the plain-text wordmark "Constructor Fabric", 10pt bold, in the footer of every page (`#6E7B8C` on light, `#A9BEDD` on dark). See the law §3.2. That is why this directory is called `reference/` and not `logos/` - there is no logo to keep here.

- `fabric-dark-ground.jpeg` - the donors' own dark ground (`ppt/media/Cover-image-1.jpeg` from the .potx): the navy gradient with the corner glow. Reference imagery only, never shipped on a slide; in CSS build the same ground from `--fx-grad-ground` + `--fx-grad-glow` instead of the bitmap. It is kept as the ground truth those gradients are matched against - and it would serve the same role for a future PPT-generation path, where OOXML draws the gradient natively too.

The web's four-square BrandMark is not part of the deck system and goes on no slide, so no copy of it ships here; the law's §5 still describes the mark so it can be recognised where it is met.
