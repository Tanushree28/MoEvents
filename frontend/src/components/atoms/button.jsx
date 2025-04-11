const Button = ({
  loading = false,
  fallbackText = "Signing In..",
  primaryText = "Sign In",
  variant = "default",
  size = "default",
  fullWidth = false,
  ...props
}) => {
  let variantOptions = {
    allVariants: {
      default: "bg-blue-500 text-white shadow hover:bg-blue-600",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      outline:
        "border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900",
      secondary: "bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200",
      ghost: "bg-transparent hover:bg-gray-100 hover:text-gray-900",
      link: "text-blue-600 underline-offset-4 hover:underline",
    },
    allSize: {
      default: "h-9 rounded-md px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs text-center",
      lg: "h-10 rounded-md px-8 text-base",
      icon: "h-9 w-9 p-2",
    },
  };

  const { allVariants, allSize } = variantOptions;
  const widthStyle = fullWidth ? "w-full align-middle text-center" : "";
  const variantStyle =
    allVariants[variant] + " " + allSize[size] + " " + widthStyle;

  return (
    <button
      type="submit"
      className={`${variantStyle}`}
      disabled={loading}
      {...props}
    >
      {loading ? fallbackText : primaryText}
    </button>
  );
};

export default Button;
