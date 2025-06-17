# Nexus Tech Digital Solutions Website

A modern, gaming-inspired website for Nexus Tech Digital Solutions with integrated Netlify forms and Firebase authentication.

## 🚀 Features

- **Modern Design**: PlayStation-inspired dark theme with cyan accents
- **Responsive**: Works perfectly on all devices
- **Form Handling**: Netlify forms with spam protection
- **User Authentication**: Firebase Auth with Google sign-in
- **User Dashboard**: Client project management and account settings
- **Real-time Database**: Firestore for project inquiries and user data
- **Professional**: Enterprise-ready with proper SEO and performance optimization

## 📁 File Structure

```
nexus-tech-website/
├── index.html              # Homepage
├── apps.html               # App Development page
├── websites.html           # Web Development page
├── services.html           # Services (Games, Templates, Support)
├── portfolio.html          # Portfolio & Case Studies
├── connect.html            # Contact & Discovery Call form
├── dashboard.html          # User Dashboard (Auth required)
├── js/
│   └── firebase-config.js  # Firebase configuration
├── netlify.toml           # Netlify configuration
├── _redirects             # Netlify redirects
├── .env.template          # Environment variables template
└── README.md              # This file
```

## 🔧 Setup Instructions

### 1. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Name it "nexus-tech-website" (or your preferred name)
   - Enable Google Analytics (optional)

2. **Configure Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" 
   - Enable "Google" sign-in
   - Add your domain to authorized domains

3. **Setup Firestore Database**:
   - Go to Firestore Database
   - Create database in "production mode"
   - Choose your preferred region
   - Set up these collections:
     - `users` (for user profiles)
     - `projectInquiries` (for form submissions)

4. **Get Firebase Config**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Web" app icon
   - Copy the config object values

5. **Configure Firestore Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Project inquiries - users can create, read their own
       match /projectInquiries/{document} {
         allow create: if request.auth != null;
         allow read: if request.auth != null && 
           (request.auth.uid == resource.data.userId || 
            request.auth.token.email in ['hello@nexustech.dev', 'admin@nexustech.dev']);
       }
     }
   }
   ```

### 2. Netlify Deployment

1. **Prepare Your Code**:
   - Upload all files to a GitHub repository
   - Update `js/firebase-config.js` with your Firebase config values
   - Ensure all files are in the root directory

2. **Deploy to Netlify**:
   - Connect your GitHub repo to Netlify
   - Build settings: 
     - Build command: `echo "No build needed"`
     - Publish directory: `/` (root)
   - Deploy the site

3. **Configure Environment Variables**:
   - Go to Site Settings > Environment Variables
   - Add your Firebase configuration:
     ```
     FIREBASE_API_KEY=your-api-key
     FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     FIREBASE_APP_ID=your-app-id
     FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
     ```

4. **Enable Form Notifications** (Optional):
   - Go to Site Settings > Forms
   - Add notification emails
   - Configure form submissions

### 3. Domain Configuration

1. **Custom Domain** (Optional):
   - Add your custom domain in Netlify
   - Update Firebase authorized domains
   - Configure DNS settings

2. **SSL Certificate**:
   - Netlify automatically provides SSL
   - Ensure HTTPS is enforced

### 4. Testing

1. **Form Submissions**:
   - Test the contact form on `/connect.html`
   - Check Netlify dashboard for submissions
   - Verify email notifications work

2. **User Authentication**:
   - Test sign up with email/password
   - Test Google sign-in
   - Check Firestore for user data
   - Test user dashboard functionality

3. **Database Operations**:
   - Submit project inquiries while signed in
   - Check dashboard shows user's projects
   - Verify data appears in Firestore

## 🛠️ Development

### Local Development

1. **Firebase Emulator** (Optional for local testing):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init emulators
   firebase emulators:start
   ```

2. **Update Firebase Config**:
   - For local development, update the config in `js/firebase-config.js`
   - Use emulator endpoints when running locally

### Customization

1. **Styling**:
   - Colors are defined as CSS variables
   - Main brand color: `#00d4ff` (cyan)
   - Background: `#0d1117` (dark blue)
   - Accent: `#0066ff` (blue)

2. **Content**:
   - Update company information in all HTML files
   - Modify services in `services.html`
   - Add real portfolio items in `portfolio.html`

3. **Forms**:
   - Additional form fields can be added to `connect.html`
   - Netlify automatically detects form changes

## 📧 Form Management

### Netlify Forms Features

- **Spam Protection**: Built-in reCAPTCHA
- **Email Notifications**: Automatic email alerts
- **Form Submissions**: View in Netlify dashboard
- **Export Data**: Download submissions as CSV
- **Webhooks**: Integrate with external services

### Adding New Forms

1. Add `data-netlify="true"` to form element
2. Include `<input type="hidden" name="form-name" value="form-name">`
3. Deploy to Netlify
4. Test form submission

## 👥 User Management

### Firebase Auth Features

- **Email/Password**: Standard authentication
- **Google Sign-in**: Social authentication  
- **User Profiles**: Stored in Firestore
- **Project Tracking**: Users can view their inquiries
- **Role-based Access**: Admin vs client roles

### Admin Access

- Admin users can view all project inquiries
- Add admin emails to Firestore security rules
- Create admin dashboard (future enhancement)

## 🔒 Security

### Best Practices Implemented

- **HTTPS Only**: Enforced via Netlify
- **Content Security Policy**: Defined in `netlify.toml`
- **Firebase Security Rules**: Protect user data
- **Environment Variables**: Sensitive data in env vars
- **Form Validation**: Client and server-side validation

## 📊 Analytics & Monitoring

### Firebase Analytics

- Automatically tracks page views
- Custom events for form submissions
- User engagement metrics
- Conversion tracking

### Netlify Analytics

- Site performance metrics
- Form submission tracking
- Error monitoring
- Traffic analysis

## 🚀 Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Authentication methods enabled
- [ ] Firestore database setup with security rules
- [ ] Firebase config added to `js/firebase-config.js`
- [ ] Code pushed to GitHub repository
- [ ] Netlify site connected to GitHub
- [ ] Environment variables configured in Netlify
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Form submissions tested
- [ ] User authentication tested
- [ ] Database operations tested
- [ ] Email notifications configured

## 💡 Future Enhancements

- **Payment Integration**: Stripe for project deposits
- **Project Management**: Detailed project tracking
- **File Uploads**: Client document sharing
- **Live Chat**: Real-time customer support
- **Blog System**: CMS integration
- **SEO Optimization**: Advanced meta tags and schema
- **Performance**: Image optimization and caching
- **Mobile App**: React Native companion app

## 📞 Support

For questions about this setup:
- **Email**: hello@nexustech.dev
- **Website**: [Your deployed site URL]
- **Repository**: [Your GitHub repo URL]

---

**Built with ❤️ for Nexus Tech Digital Solutions**