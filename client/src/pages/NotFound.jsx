import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <h1 className="text-7xl font-bold text-primary-600">404</h1>
    <p className="text-xl text-gray-600 mt-4">Page not found</p>
    <Link to="/" className="mt-6 text-primary-600 hover:underline font-medium">Go home</Link>
  </div>
);

export default NotFound;
