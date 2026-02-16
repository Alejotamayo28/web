// Cloudflare Pages Function Middleware
// Injects Open Graph meta tags for social media previews

export async function onRequest(context) {
  const { request, next } = context;
  
  // Get the response from the origin
  const response = await next();
  
  // Only process HTML responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }
  
  // Get the URL to determine the page
  const url = new URL(request.url);
  const isZapenu = url.pathname === '/zapenu';
  
  // Define meta tags based on the page
  const title = isZapenu 
    ? 'Zapenu - Digital Ordering Platform | Alejandro Vergara Tamayo'
    : 'Alejandro | Desarrollador Backend';
    
  const description = isZapenu
    ? 'Plataforma multi-tenant de pedidos digitales con arquitectura de microservicios, pagos integrados y +10k items por tienda'
    : 'Alejandro Vergara Tamayo';
    
  const image = 'https://assets.alejotamayo.com/traje-alejandro.png';
  
  // Create meta tags HTML
  const metaTags = `
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="500">
    <meta property="og:image:height" content="500">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${request.url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
  `;
  
  // Get the HTML content
  const html = await response.text();
  
  // Inject meta tags after the opening <head> tag
  const modifiedHtml = html.replace(
    '<head>',
    `<head>${metaTags}`
  );
  
  // Return modified response
  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
