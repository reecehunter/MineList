export const validatePluginForm = (formData) => {
  const newErrors = [];
  if (!formData) return newErrors;
  if (!formData.title) newErrors.push("A title is required.");
  if (formData.title && formData.title.length < 3) newErrors.push("Title must be more than 3 characters.");
  if (formData.title && formData.title.length > 30) newErrors.push("Title must be less than 30 characters.");
  // if (formData.url.length < 3) newErrors.push("URL must be at least 3 characters.");
  // if (formData.url.length > 20) newErrors.push("URL must be less than 20 characters.");
  if (!formData.summary) newErrors.push("A summary is required.");
  if (formData.summary && formData.summary.length < 30) newErrors.push("The summary must be at least 30 characters.");
  if (formData.summary && formData.summary.length > 100) newErrors.push("The summary must be less than 100 characters.");
  // if (formData.versions.length < 1) newErrors.push("You must select at least 1 working version.");
  // if (formData.tags.length < 1) newErrors.push("You must select at least 1 tag.");
  if (!formData.image) newErrors.push("You must upload an image.");
  if (!formData.description) newErrors.push("A description is required.");
  if (formData.description && formData.description.length < 100) newErrors.push("The description must be at least 100 characters.");
  // if (formData.price === "" || !formData.price) newErrors.push("You must enter a price (put $0 to make it free).");
  // const linkRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
  // for (const link of Object.values(formData.links)) {
  //   if (!link.title || link.title === "") newErrors.push("All links must have a title.");
  //   if (link.title && link.title.length > 20) newErrors.push("Link titles must be less than 20 characters.");
  //   if (link.url && !link.url.match(linkRegex)) newErrors.push("Links URL must be a valid URL.");
  //   if (!link.url || link.url === "") newErrors.push("All links must have a url.");
  //   if (link.url && link.url.length > 255) newErrors.push("Link URLs must be less than 255 characters.");
  // }
  // if (!formData.jar) newErrors.push("You must upload a plugin jar.");
  return newErrors;
};
