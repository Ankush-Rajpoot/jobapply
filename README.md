# JobApply - Candidate Application Portal

A standalone job application portal for candidates to view job descriptions and apply directly.

## Features

- View detailed job descriptions
- Apply directly with resume upload
- Clean, professional UI
- Mobile-responsive design
- Connected to hr-ai-hiring-dashboard backend

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_HASURA_ENDPOINT=https://arc.vocallabs.ai/v1/graphql
VITE_HASURA_SECRET=your_secret_here
VITE_CAMPAIGN_SERVICE_URL=https://campaign.vocallabs.ai
```

## Development

```bash
# Install dependencies
npm install

# Start development server on port 5174
npm run dev
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

## URL Structure

The application expects URLs in the format:
```
http://jobapply.site/{job-id}
```

Example:
```
http://jobapply.site/a266d560-ffef-4bf8-8847-a6517fef743e
```

## Integration with HR Dashboard

Jobs are redirected from the careers page to this application. The job ID is passed in the URL, and the application fetches the job details from the VocalLabs Hasura backend.
