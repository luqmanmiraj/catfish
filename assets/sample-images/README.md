# Sample Images for Gallery

This folder contains sample images that will be automatically added to the device gallery when the app is first launched.

## Instructions

1. Place your sample human images (JPG, PNG, or WEBP format) in this folder
2. Name them as: `person1.jpg`, `person2.jpg`, etc.
3. The images will be automatically copied to the device gallery on first app launch
4. Supported formats: JPG, PNG, WEBP
5. Recommended: Use images of humans (portraits, full body, different angles)

## Current Images

The following 16 images are included:
- `person1.jpg`
- `person2.jpg`
- `person3.jpg`
- `person4.jpg`
- `person5.jpg`
- `person6.jpg`
- `person7.jpg`
- `person8.jpg`
- `person9.png`
- `person10.jpg`
- `person11.webp`
- `person12.webp`
- `person13.webp`
- `person14.webp`
- `person15.jpg`
- `person16.jpg`

## Note

- Images are only added once (tracked via AsyncStorage)
- Requires media library permissions
- Images are bundled with the app, so they increase app size
- To reset and re-add images, use the `resetGalleryPopulatedFlag()` function in development

## Adding More Images

To add more sample images:
1. Add the image file to this folder
2. Update `catfish/services/galleryService.js` to include the new image in the `SAMPLE_IMAGES` array

