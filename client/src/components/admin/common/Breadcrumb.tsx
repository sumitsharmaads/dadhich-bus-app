import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { NavigateNext, Home } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const router = useRouter();

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick("/admin");
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Admin
        </Link>
        {items.map((item, index) => (
          <Box key={index}>
            {item.current ? (
              <Typography color="text.primary" variant="body2">
                {item.label}
              </Typography>
            ) : (
              <Link
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.href);
                }}
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {item.label}
              </Link>
            )}
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
