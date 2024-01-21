const Component = () => <div>
    {/* #if DEV */}
    DEV
    {/* #endif */}
    {/* #if DEV=true */}
    DEV=true
    {/* #endif */}
    {/* #if !PROD!=true */}
    !PROD!=true
    {/* #endif */}
</div>;
