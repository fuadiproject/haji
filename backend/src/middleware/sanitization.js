// src/middleware/sanitization.js
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Smart defaults
const defaultConfig = {
  // Field control - SMART LOGIC
  fields: "all", // 'all' = process all fields, array = specific fields only
  excludeFields: [], // Only used when fields = 'all'

  // Tag control - SMART LOGIC
  allowedTags: "none", // 'none' = no HTML, 'all' = all HTML, array = specific tags
  forbiddenTags: [], // Only used when allowedTags = 'all'

  // Attribute control
  allowedAttributes: {},
  forbiddenAttributes: [
    "onload",
    "onerror",
    "onclick",
    "onmouseover",
    "onchange",
    "onsubmit",
  ],

  // Scheme control
  allowedSchemes: ["http", "https"],

  // Auto-detection
  autoDetectFiles: true,
  fileFields: ["file", "image", "document", "attachment", "upload"],
  autoDetectRichText: true,
  richTextFields: ["content", "description", "body", "html", "text"],
  autoDetectPlainText: true,
  plainTextFields: [
    "title",
    "name",
    "username",
    "email",
    "phone",
    "address",
    "category",
    "status",
  ],

  // Content-based detection
  detectByContent: true,
  htmlPattern: /<[^>]+>/g,
  filePattern: /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar)$/i,

  // Mode system
  mode: "auto", // 'auto', 'strict', 'rich', 'custom'
};

// Pre-defined modes
const modes = {
  strict: {
    allowedTags: "none",
    forbiddenTags: [],
    allowedAttributes: {},
    forbiddenAttributes: [
      "onload",
      "onerror",
      "onclick",
      "onmouseover",
      "onchange",
      "onsubmit",
    ],
  },

  rich: {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "i",
      "b",
      "s",
      "strike",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "div",
      "span",
      "section",
      "article",
      "header",
      "footer",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      table: ["border", "cellpadding", "cellspacing"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
      "*": ["class", "id", "data-*", "style"],
    },
    forbiddenTags: [],
    forbiddenAttributes: [
      "onload",
      "onerror",
      "onclick",
      "onmouseover",
      "onchange",
      "onsubmit",
    ],
  },

  auto: {
    allowedTags: "auto",
    forbiddenTags: [],
    allowedAttributes: {},
    forbiddenAttributes: [
      "onload",
      "onerror",
      "onclick",
      "onmouseover",
      "onchange",
      "onsubmit",
    ],
    autoDetectFiles: true,
    autoDetectRichText: true,
    autoDetectPlainText: true,
    detectByContent: true,
    fileFields: [
      "file",
      "image",
      "document",
      "attachment",
      "upload",
      "avatar",
      "photo",
      "picture",
    ],
    richTextFields: [
      "content",
      "description",
      "body",
      "html",
      "text",
      "message",
      "comment",
      "bio",
      "about",
    ],
    plainTextFields: [
      "title",
      "name",
      "username",
      "email",
      "phone",
      "address",
      "category",
      "status",
    ],
    htmlPattern: /<[^>]+>/g,
    filePattern: /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar)$/i,
  },
};

// Main middleware factory
export const createSanitizationMiddleware = (userConfig = {}) => {
  const config = mergeConfig(userConfig);

  return (req, res, next) => {
    try {
      if (req.body) {
        req.body = sanitizeObject(req.body, config);
      }

      // req.query and req.params are read-only, so we sanitize in place
      if (req.query) {
        sanitizeObjectInPlace(req.query, config);
      }

      if (req.params) {
        sanitizeObjectInPlace(req.params, config);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Smart config merger
const mergeConfig = (userConfig) => {
  let config = { ...defaultConfig };

  // Apply mode first
  if (userConfig.mode && modes[userConfig.mode]) {
    config = { ...config, ...modes[userConfig.mode] };
  }

  // Override with user config
  config = { ...config, ...userConfig };

  // Generate field rules for auto-detection
  if (
    config.autoDetectFiles ||
    config.autoDetectRichText ||
    config.autoDetectPlainText
  ) {
    config.fieldRules = generateFieldRules(config);
  }

  return config;
};

// Generate field-specific rules
const generateFieldRules = (config) => {
  const rules = {};

  // File fields - no HTML at all
  if (config.autoDetectFiles) {
    config.fileFields.forEach((field) => {
      rules[field] = {
        allowedTags: "none",
        forbiddenTags: [],
        allowedAttributes: {},
        forbiddenAttributes: ["all"],
        fieldType: "file",
      };
    });
  }

  // Rich text fields - allow safe HTML
  if (config.autoDetectRichText) {
    config.richTextFields.forEach((field) => {
      rules[field] = {
        allowedTags:
          config.allowedTags === "auto"
            ? modes.rich.allowedTags
            : config.allowedTags,
        forbiddenTags: config.forbiddenTags,
        allowedAttributes: config.allowedAttributes,
        forbiddenAttributes: config.forbiddenAttributes,
        fieldType: "richText",
      };
    });
  }

  // Plain text fields - no HTML
  if (config.autoDetectPlainText) {
    config.plainTextFields.forEach((field) => {
      rules[field] = {
        allowedTags: "none",
        forbiddenTags: [],
        allowedAttributes: {},
        forbiddenAttributes: ["all"],
        fieldType: "plainText",
      };
    });
  }

  return rules;
};

// Smart object sanitization
const sanitizeObject = (obj, config) => {
  if (typeof obj === "string") {
    return sanitizeString(obj, config);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, config));
  }

  if (obj && typeof obj === "object") {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
      // Check if field should be processed
      if (shouldProcessField(key, config)) {
        // Get field-specific config with content detection
        const fieldConfig = getFieldConfig(key, value, config);
        sanitized[key] = sanitizeObject(value, fieldConfig);
      } else {
        sanitized[key] = value; // Keep as-is
      }
    }

    return sanitized;
  }

  return obj;
};

// Sanitize object in place (for read-only objects like req.query, req.params)
const sanitizeObjectInPlace = (obj, config) => {
  if (typeof obj === "string") {
    return sanitizeString(obj, config);
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = sanitizeObjectInPlace(obj[i], config);
    }
    return obj;
  }

  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      // Check if field should be processed
      if (shouldProcessField(key, config)) {
        // Get field-specific config with content detection
        const fieldConfig = getFieldConfig(key, value, config);
        obj[key] = sanitizeObjectInPlace(value, fieldConfig);
      }
      // Keep as-is if not processed
    }

    return obj;
  }

  return obj;
};

// SMART FIELD LOGIC
const shouldProcessField = (fieldName, config) => {
  // If fields is 'all', process all fields except excluded ones
  if (config.fields === "all") {
    return !config.excludeFields.includes(fieldName);
  }

  // If fields is array, only process those specific fields
  if (Array.isArray(config.fields)) {
    return config.fields.includes(fieldName);
  }

  // Default: process all fields
  return true;
};

// Get field-specific config with content detection
const getFieldConfig = (fieldName, value, config) => {
  // Check if field has specific rules
  if (config.fieldRules && config.fieldRules[fieldName]) {
    return { ...config, ...config.fieldRules[fieldName] };
  }

  // Content-based detection for auto mode
  if (
    config.mode === "auto" &&
    config.detectByContent &&
    typeof value === "string"
  ) {
    return detectFieldTypeByContent(fieldName, value, config);
  }

  return config;
};

// Content-based field type detection
const detectFieldTypeByContent = (fieldName, value, config) => {
  // Detect HTML content
  if (config.htmlPattern.test(value)) {
    return {
      ...config,
      allowedTags: modes.rich.allowedTags,
      forbiddenTags: [
        "script",
        "iframe",
        "object",
        "embed",
        "form",
        "input",
        "button",
      ],
      allowedAttributes: modes.rich.allowedAttributes,
      forbiddenAttributes: [
        "onload",
        "onerror",
        "onclick",
        "onmouseover",
        "onchange",
        "onsubmit",
      ],
      fieldType: "richText",
    };
  }

  // Detect file content (base64, file paths, etc.)
  if (
    config.filePattern.test(value) ||
    value.startsWith("data:") ||
    value.startsWith("/uploads/")
  ) {
    return {
      ...config,
      allowedTags: "none",
      forbiddenTags: [],
      allowedAttributes: {},
      forbiddenAttributes: ["all"],
      fieldType: "file",
    };
  }

  // Default to plain text
  return {
    ...config,
    allowedTags: "none",
    forbiddenTags: [],
    allowedAttributes: {},
    forbiddenAttributes: ["all"],
    fieldType: "plainText",
  };
};

// String sanitization with SMART TAG LOGIC
const sanitizeString = (str, config) => {
  if (!str || typeof str !== "string") return str;

  const purifyConfig = {
    ALLOWED_ATTR: Object.values(config.allowedAttributes).flat(),
    FORBID_ATTR: config.forbiddenAttributes,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    ALLOW_DATA_ATTR: true,
  };

  // SMART TAG LOGIC
  if (config.allowedTags === "none") {
    // No HTML tags allowed
    purifyConfig.ALLOWED_TAGS = [];
    purifyConfig.FORBID_TAGS = ["all"];
  } else if (config.allowedTags === "all") {
    // All HTML tags allowed, except forbidden ones
    purifyConfig.ALLOWED_TAGS = ["all"];
    purifyConfig.FORBID_TAGS = config.forbiddenTags;
  } else if (Array.isArray(config.allowedTags)) {
    // Specific tags allowed
    purifyConfig.ALLOWED_TAGS = config.allowedTags;
    purifyConfig.FORBID_TAGS = config.forbiddenTags;
  } else {
    // Default: no HTML
    purifyConfig.ALLOWED_TAGS = [];
    purifyConfig.FORBID_TAGS = ["all"];
  }

  return purify.sanitize(str, purifyConfig);
};
