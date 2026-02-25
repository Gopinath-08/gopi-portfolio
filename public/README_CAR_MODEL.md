# Car Model Setup Instructions

## Extract Your Zip File

1. Extract the zip file `free_concept_car_004_-_public_domain_cc0` 
2. Copy ALL files from the extracted folder to this directory (`frontend/public/`):
   - `scene.gltf`
   - `scene.bin`
   - `textures/` folder (with all texture files inside)
   - `license` (optional)

## File Structure Should Be:
```
frontend/public/
  ├── scene.gltf
  ├── scene.bin
  ├── textures/
  │   └── (all texture files)
  └── license
```

## Important Notes:
- Keep all files in the same directory (`public/`)
- The `scene.gltf` file references `scene.bin` and textures, so they must be in the same location
- The game will automatically load `scene.gltf` when you start playing

