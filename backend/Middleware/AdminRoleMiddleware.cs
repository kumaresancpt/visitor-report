namespace Backend.Middleware;

public class AdminRoleMiddleware
{
    private readonly RequestDelegate _next;
    
    public AdminRoleMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/reports"))
        {
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { detail = "Authentication required. Please log in." });
                return;
            }
            
            if (!context.User.IsInRole("Admin"))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsJsonAsync(new { detail = "You do not have permission to view reports. Please contact your administrator." });
                return;
            }
        }
        
        await _next(context);
    }
}
