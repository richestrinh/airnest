export default function Image({ src,...rest }) {
  // Check if path is a full link. 
  src = src && src.includes('https://') 
  ? src : 'http://localhost:4000/uploads/'+src;

  return (
    <img {...rest} src={src} alt={''} />
  );
}