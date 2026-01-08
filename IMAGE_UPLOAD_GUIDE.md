# Image Upload Guide - GitHub Storage

This guide explains how images are uploaded and stored in the GitHub repository.

## How It Works

✅ **Images stored in GitHub** - All uploaded images are saved in `public/images/` folder  
✅ **Organized by category** - Images are organized into subfolders (news, projects, members, events, media)  
✅ **Automatic URL generation** - Images are accessible via `/images/{category}/{filename}`  
✅ **Frontend display** - Images automatically display on the frontend using the stored URLs  

## Folder Structure

```
public/
  images/
    news/          # News article images
    projects/      # Project images
    members/       # Member profile images
    events/       # Event images
    media/         # General media files
```

## Upload Process

1. **Admin uploads image** via the admin panel
2. **Image saved** to `public/images/{category}/` folder
3. **URL stored** in database (e.g., `/images/news/article-1234567890.jpg`)
4. **Image committed** to GitHub when you push code
5. **Frontend displays** image using the stored URL

## Usage in Admin Panel

### News Articles
- When creating/editing a news article, use the "Featured Image" upload field
- Image is automatically uploaded to `public/images/news/`
- URL is saved with the article

### Projects
- Upload project images when creating/editing projects
- Images stored in `public/images/projects/`

### Members
- Upload member profile photos
- Images stored in `public/images/members/`

### Events
- Upload event banner images
- Images stored in `public/images/events/`

## Frontend Display

Images are automatically accessible on the frontend:

```tsx
// In your React components
<img src="/images/news/article-1234567890.jpg" alt="Article" />

// Or using the stored URL from database
<img src={article.image} alt={article.title} />
```

## File Size Limits

- **Maximum file size**: 5MB per image
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Recommended**: Optimize images before uploading for better performance

## GitHub Considerations

### File Size
- GitHub has a 100MB file size limit per file
- Large images (>50MB) may cause issues
- **Recommendation**: Keep images under 1MB when possible

### Repository Size
- GitHub repositories have a 1GB soft limit
- Monitor your repository size as you add images
- Consider image optimization tools

### Best Practices
1. **Optimize images** before uploading (use tools like TinyPNG, ImageOptim)
2. **Use appropriate formats**:
   - JPEG for photos
   - PNG for graphics with transparency
   - WebP for modern browsers (smaller file size)
3. **Resize images** to appropriate dimensions (e.g., 1200px width for news articles)
4. **Compress images** to reduce file size

## Image Optimization Tools

- **TinyPNG**: https://tinypng.com (online)
- **ImageOptim**: https://imageoptim.com (Mac app)
- **Squoosh**: https://squoosh.app (Google's online tool)
- **Sharp**: Node.js library for programmatic optimization

## API Endpoints

### Upload Single Image
```typescript
POST /api/upload/image?category=news
Content-Type: multipart/form-data

FormData:
  image: File
```

Response:
```json
{
  "success": true,
  "url": "/images/news/article-1234567890.jpg",
  "filename": "article-1234567890.jpg",
  "size": 245678,
  "category": "news"
}
```

### Upload Multiple Images
```typescript
POST /api/upload/images?category=projects
Content-Type: multipart/form-data

FormData:
  images: File[] (max 10)
```

## Troubleshooting

**Image not displaying:**
- Check the URL path is correct
- Verify image exists in `public/images/` folder
- Ensure image was committed to GitHub
- Check browser console for 404 errors

**Upload fails:**
- Check file size is under 5MB
- Verify file is an image format (JPEG, PNG, GIF, WebP)
- Check server logs for errors
- Ensure `public/images/` folders exist

**Large repository size:**
- Optimize existing images
- Consider using Git LFS for large files
- Or migrate to cloud storage (Supabase, Cloudinary) for production

## Migration to Cloud Storage (Optional)

If your repository gets too large, you can migrate to cloud storage:

1. **Supabase Storage** (recommended)
   - Free tier: 1GB
   - Easy integration
   - CDN included

2. **Cloudinary**
   - Free tier: 25GB
   - Automatic optimization
   - Image transformations

3. **AWS S3**
   - Pay-as-you-go
   - Highly scalable
   - Requires AWS account

See `DATABASE_SETUP.md` for Supabase setup instructions.
