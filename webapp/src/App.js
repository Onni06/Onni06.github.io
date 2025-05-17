import { useState, useCallback, lazy, Suspense, memo, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Divider,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Timer,
  Restaurant,
  LocalDining,
  AccessTime,
  TrendingUp,
  FitnessCenter,
  Favorite as FavoriteIcon,
  Bookmark,
  BookmarkBorder,
  Share,
  ExpandMore,
  ExpandLess,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    secondary: {
      main: '#ff6f00',
      light: '#ff8f00',
      dark: '#c43e00',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Remove Edamam constants and keep only TheMealDB
const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Add nutritional database for common ingredients
const nutritionalDatabase = {
  // Proteins
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 17 },
  'pork': { calories: 242, protein: 27, carbs: 0, fat: 14 },
  'fish': { calories: 120, protein: 22, carbs: 0, fat: 3.5 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  'chickpeas': { calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  
  // Dairy
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33 },
  'yogurt': { calories: 59, protein: 3.5, carbs: 4.7, fat: 3.3 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
  
  // Grains
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'pasta': { calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  'flour': { calories: 364, protein: 10, carbs: 76, fat: 1 },
  
  // Vegetables
  'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  'carrot': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  
  // Fruits
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  'banana': { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  'orange': { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
  
  // Nuts and Seeds
  'almond': { calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9 },
  'peanut': { calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2 },
  'walnut': { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2 },
  
  // Oils and Fats
  'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100 },
  'vegetable oil': { calories: 884, protein: 0, carbs: 0, fat: 100 },
  
  // Spices and Herbs
  'salt': { calories: 0, protein: 0, carbs: 0, fat: 0 },
  'pepper': { calories: 251, protein: 10.4, carbs: 64, fat: 3.3 },
  'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
  'ginger': { calories: 80, protein: 1.8, carbs: 18, fat: 0.8 }
};

// Add difficulty level time ranges
const difficultyTimeRanges = {
  1: { min: 0, max: 15 },    // Easy: 0-15 minutes
  2: { min: 15, max: 30 },   // Easy-Medium: 15-30 minutes
  3: { min: 30, max: 45 },   // Medium: 30-45 minutes
  4: { min: 45, max: 60 },   // Medium-Hard: 45-60 minutes
  5: { min: 60, max: 120 }   // Hard: 60-120 minutes
};

// Add function to check if recipe meets health criteria
const checkHealthCriteria = (recipe, nutrition) => {
  const isHighProtein = nutrition.perServing.protein >= 20;
  const isQuickMeal = recipe.readyInMinutes <= 20;
  const isHealthy = nutrition.perServing.fat < 15 && 
                   nutrition.perServing.carbs < 30 && 
                   nutrition.perServing.protein >= 15;

  return {
    isHighProtein,
    isQuickMeal,
    isHealthy
  };
};

// Update meal types with more specific categories
const mealTypes = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
  'Side Dish',
  'Drink'
];

// Add function to determine meal type based on recipe details
const determineMealType = (recipe) => {
  const title = recipe.strMeal.toLowerCase();
  const category = recipe.strCategory?.toLowerCase() || '';
  const tags = recipe.strTags?.toLowerCase().split(',') || [];

  // Breakfast indicators
  if (
    title.includes('breakfast') ||
    title.includes('pancake') ||
    title.includes('waffle') ||
    title.includes('omelette') ||
    title.includes('toast') ||
    title.includes('cereal') ||
    title.includes('porridge') ||
    title.includes('oatmeal') ||
    category.includes('breakfast') ||
    tags.some(tag => tag.includes('breakfast'))
  ) {
    return 'Breakfast';
  }

  // Dessert indicators
  if (
    title.includes('cake') ||
    title.includes('pie') ||
    title.includes('ice cream') ||
    title.includes('pudding') ||
    title.includes('cookie') ||
    title.includes('brownie') ||
    title.includes('chocolate') ||
    title.includes('sweet') ||
    category.includes('dessert') ||
    tags.some(tag => tag.includes('dessert'))
  ) {
    return 'Dessert';
  }

  // Appetizer indicators
  if (
    title.includes('appetizer') ||
    title.includes('starter') ||
    title.includes('dip') ||
    title.includes('bruschetta') ||
    title.includes('canapé') ||
    title.includes('finger food') ||
    category.includes('starter') ||
    tags.some(tag => tag.includes('starter'))
  ) {
    return 'Appetizer';
  }

  // Side dish indicators
  if (
    title.includes('side') ||
    title.includes('salad') ||
    title.includes('vegetable') ||
    title.includes('rice') ||
    title.includes('potato') ||
    category.includes('side') ||
    tags.some(tag => tag.includes('side'))
  ) {
    return 'Side Dish';
  }

  // Drink indicators
  if (
    title.includes('drink') ||
    title.includes('cocktail') ||
    title.includes('smoothie') ||
    title.includes('juice') ||
    title.includes('tea') ||
    title.includes('coffee') ||
    category.includes('drink') ||
    tags.some(tag => tag.includes('drink'))
  ) {
    return 'Drink';
  }

  // Snack indicators
  if (
    title.includes('snack') ||
    title.includes('finger food') ||
    title.includes('bite') ||
    category.includes('snack') ||
    tags.some(tag => tag.includes('snack'))
  ) {
    return 'Snack';
  }

  // Default to main meal types based on time of day
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return 'Breakfast';
  } else if (hour >= 11 && hour < 15) {
    return 'Lunch';
  } else {
    return 'Dinner';
  }
};

// Add common allergens and their variations
const commonAllergens = {
  'nuts': [
    'almond', 'cashew', 'walnut', 'pecan', 'hazelnut', 'pistachio', 'macadamia',
    'brazil nut', 'pine nut', 'peanut', 'nut', 'peanut butter', 'almond milk',
    'cashew milk', 'nut milk', 'nut butter', 'marzipan', 'praline'
  ],
  'shellfish': [
    'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'mussel', 'clam', 'oyster',
    'scallop', 'squid', 'octopus', 'shellfish', 'crustacean', 'mollusk'
  ],
  'dairy': [
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein', 'lactose',
    'sour cream', 'buttermilk', 'heavy cream', 'half and half', 'ghee', 'kefir',
    'cottage cheese', 'ricotta', 'mozzarella', 'parmesan', 'cheddar', 'swiss',
    'brie', 'camembert', 'feta', 'goat cheese', 'blue cheese', 'gorgonzola',
    'cream cheese', 'mascarpone', 'provolone', 'asiago', 'pecorino', 'manchego',
    'gruyere', 'havarti', 'gouda', 'edam', 'colby', 'monterey jack', 'pepper jack',
    'string cheese', 'cream', 'whipping cream', 'sour cream', 'crème fraîche',
    'yogurt', 'greek yogurt', 'buttermilk', 'kefir', 'milk', 'whole milk',
    'skim milk', '2% milk', '1% milk', 'condensed milk', 'evaporated milk',
    'powdered milk', 'butter', 'margarine', 'ghee', 'clarified butter'
  ],
  'eggs': [
    'egg', 'eggs', 'egg white', 'egg yolk', 'albumen', 'albumin', 'mayonnaise',
    'mayo', 'egg wash', 'egg replacer', 'egg substitute', 'egg powder',
    'dried egg', 'egg protein'
  ],
  'soy': [
    'soy', 'soya', 'soybean', 'soy sauce', 'tamari', 'miso', 'tofu', 'tempeh',
    'edamame', 'soy milk', 'soy protein', 'soy flour', 'soy lecithin',
    'soy oil', 'soybean oil'
  ],
  'wheat': [
    'wheat', 'flour', 'bread', 'pasta', 'cereal', 'barley', 'rye', 'semolina',
    'couscous', 'bulgur', 'spelt', 'kamut', 'farro', 'breadcrumbs', 'crackers',
    'pretzels', 'beer', 'malt', 'wheat flour', 'all-purpose flour', 'bread flour',
    'cake flour', 'pastry flour', 'self-rising flour', 'whole wheat flour',
    'wheat germ', 'wheat bran', 'wheat berries', 'durum wheat', 'spelt flour',
    'rye flour', 'barley flour', 'malt flour', 'malt extract', 'malt syrup',
    'malt vinegar', 'beer', 'ale', 'lager', 'stout', 'wheat beer', 'bread',
    'rolls', 'buns', 'bagels', 'pita', 'naan', 'tortillas', 'wraps', 'pasta',
    'noodles', 'spaghetti', 'macaroni', 'penne', 'fettuccine', 'linguine',
    'lasagna', 'ravioli', 'couscous', 'bulgur', 'farro', 'spelt', 'kamut',
    'barley', 'rye', 'crackers', 'pretzels', 'cookies', 'cakes', 'pastries',
    'pies', 'crusts', 'breading', 'coating', 'thickener', 'starch'
  ],
  'fish': [
    'fish', 'salmon', 'tuna', 'cod', 'haddock', 'trout', 'mackerel', 'sardine',
    'herring', 'tilapia', 'sea bass', 'anchovy', 'fish sauce', 'fish oil',
    'fish stock', 'fish broth', 'fish paste', 'fish powder'
  ],
  'sesame': [
    'sesame', 'sesame seed', 'sesame oil', 'tahini', 'sesame paste',
    'sesame flour', 'sesame protein'
  ]
};

// Add function to check for allergens
const checkAllergies = (recipe, allergies) => {
  if (!allergies) return true;
  
  // Extract all ingredients and convert to lowercase for consistent comparison
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.toLowerCase().trim());
    }
  }

  // Split allergies string into array and trim each item
  const userAllergies = allergies.toLowerCase().split(',').map(a => a.trim());

  // Check each user-specified allergy against the recipe ingredients
  for (const allergy of userAllergies) {
    // Get the list of variations for this allergy
    const allergenVariations = commonAllergens[allergy] || [allergy];
    
    // Check if any ingredient contains any of the allergen variations
    const hasAllergen = ingredients.some(ingredient =>
      allergenVariations.some(variation => ingredient.includes(variation))
    );

    if (hasAllergen) {
      return false; // Recipe contains an allergen
    }
  }

  return true; // Recipe is safe
};

// Memoize RecipeCard
const RecipeCard = memo(({ recipe, isSaved, onSave, onExpand, expanded, onView }) => {
  const [showTotalNutrition, setShowTotalNutrition] = useState(false);
  const nutrition = calculateNutrition(
    recipe.ingredients?.map(ing => ing.name.toLowerCase()) || [],
    recipe.servings
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image+Available'}
        alt={recipe.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {recipe.title}
          </Typography>
          <IconButton onClick={() => onSave(recipe)} color="primary">
            {isSaved ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Restaurant />}
            label={recipe.category}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<LocalDining />}
            label={recipe.area}
            size="small"
            color="primary"
            variant="outlined"
          />
          {Object.entries(recipe.dietaryInfo).map(([key, value]) => {
            if (value) {
              const label = key.replace('is', '').replace(/([A-Z])/g, ' $1').trim();
              return (
                <Chip
                  key={key}
                  label={label}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              );
            }
            return null;
          })}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Ainekset:
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {recipe.ingredients?.map(ing => ing.original).join(', ') || 'Ei aineksia luetellu'}
          </Typography>
          <Button
            size="small"
            onClick={() => onExpand(recipe.id)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          >
            {expanded ? 'Näytä vähemmän' : 'Näytä enemmän'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Timer />}
            label={`${recipe.readyInMinutes} min`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<Restaurant />}
            label={recipe.mealType}
            size="small"
            color="primary"
            variant="outlined"
          />
          {recipe.dietaryInfo.isHighProtein && (
            <Chip
              icon={<FitnessCenter />}
              label="Runsasproteiininen"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          {recipe.dietaryInfo.isQuickMeal && (
            <Chip
              icon={<AccessTime />}
              label="Alle 20 minuuttia"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          {recipe.dietaryInfo.isHealthy && (
            <Chip
              icon={<TrendingUp />}
              label="Terveellinen"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Ravintosisältö
            </Typography>
            <Button
              size="small"
              onClick={() => setShowTotalNutrition(!showTotalNutrition)}
              endIcon={showTotalNutrition ? <ExpandLess /> : <ExpandMore />}
            >
              {showTotalNutrition ? 'Näytä per annos' : 'Näytä yhteensä'}
            </Button>
          </Box>
          
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
            {showTotalNutrition 
              ? `Yhteensä ${recipe.servings} annokselle`
              : 'Per annos'}
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                Kalorit: {showTotalNutrition 
                  ? nutrition.total.calories 
                  : nutrition.perServing.calories}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Proteiini: {showTotalNutrition 
                  ? nutrition.total.protein 
                  : nutrition.perServing.protein}g
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Hiilihydraatit: {showTotalNutrition 
                  ? nutrition.total.carbs 
                  : nutrition.perServing.carbs}g
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Rasva: {showTotalNutrition 
                  ? nutrition.total.fat 
                  : nutrition.perServing.fat}g
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {Object.entries(recipe.allergyInfo || {}).map(([allergy, contains]) => (
            <Chip
              key={allergy}
              icon={contains ? <Warning /> : <CheckCircle />}
              label={`${allergy} ${contains ? 'Sisältää' : 'Vapaa'}`}
              size="small"
              color={contains ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onView(recipe)}
            startIcon={<LocalDining />}
          >
            Näytä resepti
          </Button>
          <Tooltip title="Jaa resepti">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
});

// Add function to calculate nutrition
const calculateNutrition = (ingredients, servings = 4) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  ingredients.forEach(ingredient => {
    const matchingIngredient = Object.keys(nutritionalDatabase).find(key => 
      ingredient.includes(key)
    );

    if (matchingIngredient) {
      const nutrition = nutritionalDatabase[matchingIngredient];
      totalCalories += nutrition.calories;
      totalProtein += nutrition.protein;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
    }
  });

  const servingMultiplier = servings / 4;
  return {
    perServing: {
      calories: Math.round(totalCalories * servingMultiplier),
      protein: Math.round(totalProtein * servingMultiplier * 10) / 10,
      carbs: Math.round(totalCarbs * servingMultiplier * 10) / 10,
      fat: Math.round(totalFat * servingMultiplier * 10) / 10
    },
    total: {
      calories: Math.round(totalCalories * servings),
      protein: Math.round(totalProtein * servings * 10) / 10,
      carbs: Math.round(totalCarbs * servings * 10) / 10,
      fat: Math.round(totalFat * servings * 10) / 10
    }
  };
};

function App() {
  const [formData, setFormData] = useState({
    ingredients: '',
    servings: 2,
    cuisine: '',
    mealType: '',
    diet: '',
    customDiet: '',
    highProtein: false,
    quickMeal: false,
    healthy: false,
    difficulty: 1,
    allergies: '',
  });

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const diets = [
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Dairy Free',
    'Low Carb',
    'High Protein'
  ];
  const cuisines = [
    'American', 'British', 'Chinese', 'French', 'Indian', 'Italian', 
    'Japanese', 'Mexican', 'Thai', 'Vietnamese', 'Turkish', 'Spanish',
    'Greek', 'German', 'Russian', 'Polish', 'Jamaican', 'Irish'
  ];

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  // Update the checkDietaryPreferences function with stricter checks
  const checkDietaryPreferences = (recipe, diet) => {
    if (!diet) return true;
    
    // Extract all ingredients and convert to lowercase for consistent comparison
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient.toLowerCase().trim());
      }
    }

    // Calculate nutrition for the recipe
    const nutrition = calculateNutrition(ingredients);

    // Common non-vegetarian ingredients with variations
    const meatIngredients = [
      'beef', 'chicken', 'pork', 'lamb', 'meat', 'fish', 'seafood',
      'bacon', 'ham', 'sausage', 'turkey', 'duck', 'goose', 'venison',
      'rabbit', 'quail', 'pheasant', 'anchovy', 'tuna', 'salmon', 'cod',
      'shrimp', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'chicken',
      'beef', 'pork', 'lamb', 'mutton', 'veal', 'bacon', 'ham', 'sausage',
      'pepperoni', 'salami', 'prosciutto', 'chorizo', 'poultry', 'game',
      'meatball', 'mince', 'ground beef', 'ground pork', 'ground turkey',
      'chicken breast', 'chicken thigh', 'chicken wing', 'chicken leg',
      'pork chop', 'pork loin', 'pork belly', 'beef steak', 'beef roast',
      'lamb chop', 'lamb shank', 'fish fillet', 'fish steak', 'shellfish',
      'seafood', 'anchovy', 'tuna', 'salmon', 'cod', 'haddock', 'trout',
      'mackerel', 'sardine', 'herring', 'tilapia', 'sea bass', 'shrimp',
      'prawn', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'scallop',
      'squid', 'octopus', 'calamari'
    ];

    // Common dairy ingredients with variations
    const dairyIngredients = [
      'milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein',
      'lactose', 'sour cream', 'buttermilk', 'heavy cream', 'half and half',
      'ghee', 'kefir', 'cottage cheese', 'ricotta', 'mozzarella', 'parmesan',
      'cheddar', 'swiss', 'brie', 'camembert', 'feta', 'goat cheese',
      'blue cheese', 'gorgonzola', 'cream cheese', 'mascarpone', 'provolone',
      'asiago', 'pecorino', 'manchego', 'gruyere', 'havarti', 'gouda',
      'edam', 'colby', 'monterey jack', 'pepper jack', 'string cheese',
      'cream', 'whipping cream', 'sour cream', 'crème fraîche', 'yogurt',
      'greek yogurt', 'buttermilk', 'kefir', 'milk', 'whole milk',
      'skim milk', '2% milk', '1% milk', 'condensed milk', 'evaporated milk',
      'powdered milk', 'butter', 'margarine', 'ghee', 'clarified butter'
    ];

    // Common gluten-containing ingredients with variations
    const glutenIngredients = [
      'wheat', 'flour', 'bread', 'pasta', 'cereal', 'barley', 'rye',
      'semolina', 'couscous', 'bulgur', 'spelt', 'kamut', 'farro',
      'breadcrumbs', 'crackers', 'pretzels', 'beer', 'malt', 'wheat flour',
      'all-purpose flour', 'bread flour', 'cake flour', 'pastry flour',
      'self-rising flour', 'whole wheat flour', 'wheat germ', 'wheat bran',
      'wheat berries', 'durum wheat', 'spelt flour', 'rye flour', 'barley flour',
      'malt flour', 'malt extract', 'malt syrup', 'malt vinegar', 'beer',
      'ale', 'lager', 'stout', 'wheat beer', 'bread', 'rolls', 'buns',
      'bagels', 'pita', 'naan', 'tortillas', 'wraps', 'pasta', 'noodles',
      'spaghetti', 'macaroni', 'penne', 'fettuccine', 'linguine', 'lasagna',
      'ravioli', 'couscous', 'bulgur', 'farro', 'spelt', 'kamut', 'barley',
      'rye', 'crackers', 'pretzels', 'cookies', 'cakes', 'pastries', 'pies',
      'crusts', 'breading', 'coating', 'thickener', 'starch'
    ];

    // Helper function to check if any ingredient contains any of the restricted items
    const containsAny = (ingredients, restrictedItems) => {
      return ingredients.some(ingredient => 
        restrictedItems.some(item => ingredient.includes(item))
      );
    };

    switch (diet.toLowerCase()) {
      case 'vegetarian':
        return !containsAny(ingredients, meatIngredients);
      
      case 'vegan':
        return !containsAny(ingredients, [...meatIngredients, ...dairyIngredients]) &&
               !ingredients.some(ing => 
                 ['egg', 'honey', 'gelatin', 'mayonnaise', 'albumen'].some(item => 
                   ing.includes(item)
                 )
               );
      
      case 'gluten free':
        return !containsAny(ingredients, glutenIngredients);
      
      case 'dairy free':
        return !containsAny(ingredients, dairyIngredients);
      
      case 'low carb':
        return nutrition.perServing.carbs < 20;
      
      case 'high protein':
        return nutrition.perServing.protein >= 20;
      
      default:
        return true;
    }
  };

  // Optimize recipe filtering with useMemo
  const filteredRecipes = useMemo(() => {
    if (!recipes.length) return [];
    
    let filtered = [...recipes];
    
    if (formData.mealType) {
      filtered = filtered.filter(recipe => recipe.mealType === formData.mealType);
    }
    
    if (formData.highProtein) {
      filtered = filtered.filter(recipe => recipe.dietaryInfo.isHighProtein);
    }
    
    if (formData.quickMeal) {
      filtered = filtered.filter(recipe => recipe.dietaryInfo.isQuickMeal);
    }
    
    if (formData.healthy) {
      filtered = filtered.filter(recipe => recipe.dietaryInfo.isHealthy);
    }
    
    return filtered.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
  }, [recipes, formData.mealType, formData.highProtein, formData.quickMeal, formData.healthy]);

  // Replace the RecipeList component with a simpler version
  const RecipeList = () => {
    return (
      <Grid container spacing={3}>
        {filteredRecipes.map((recipe) => (
          <Grid key={recipe.id} xs={12} sm={6} md={4}>
            <RecipeCard
              recipe={recipe}
              isSaved={savedRecipes.some(r => r.id === recipe.id)}
              onSave={toggleSaveRecipe}
              onExpand={toggleExpandRecipe}
              expanded={expandedRecipe === recipe.id}
              onView={handleRecipeClick}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let recipes = [];
      
      // If cuisine is selected, first get recipes by area
      if (formData.cuisine) {
        const areaResponse = await axios.get(`${MEALDB_BASE_URL}/filter.php`, {
          params: {
            a: formData.cuisine
          }
        });
        
        if (areaResponse.data.meals) {
          // Get full details for each recipe
          const recipePromises = areaResponse.data.meals.map(meal => 
            axios.get(`${MEALDB_BASE_URL}/lookup.php`, {
              params: { i: meal.idMeal }
            })
          );
          
          const recipeDetails = await Promise.all(recipePromises);
          recipes = recipeDetails.map(response => response.data.meals[0]);
        }
      } else {
        // If no cuisine selected, search by ingredient
        const searchQuery = formData.ingredients.split(',')[0].trim();
        const searchResponse = await axios.get(`${MEALDB_BASE_URL}/search.php`, {
          params: {
            s: searchQuery
          }
        });
        
        if (searchResponse.data.meals) {
          recipes = searchResponse.data.meals;
        }
      }

      // Apply dietary filter first
      if (formData.diet) {
        recipes = recipes.filter(recipe => checkDietaryPreferences(recipe, formData.diet));
      }

      // Apply allergy filter
      if (formData.allergies) {
        recipes = recipes.filter(recipe => checkAllergies(recipe, formData.allergies));
      }

      // Transform and filter recipes
      const transformedRecipes = recipes.map(meal => {
        // Extract ingredients and measurements
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            // Adjust ingredient amounts based on servings
            let adjustedMeasure = measure;
            if (formData.servings && formData.servings !== 4) {
              const match = measure.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
              if (match) {
                const [_, amount, unit] = match;
                const adjustedAmount = (parseFloat(amount) * formData.servings / 4).toFixed(2);
                adjustedMeasure = `${adjustedAmount} ${unit}`.trim();
              }
            }
            
            ingredients.push({
              id: i,
              name: ingredient,
              amount: adjustedMeasure,
              unit: '',
              original: `${adjustedMeasure} ${ingredient}`
            });
          }
        }

        // Calculate nutrition
        const nutrition = calculateNutrition(
          ingredients.map(ing => ing.name.toLowerCase()),
          formData.servings
        );

        // Estimate cooking time based on ingredients and complexity
        const estimatedTime = Math.ceil(ingredients.length * 2.5); // Base time per ingredient
        const difficultyTimeRange = difficultyTimeRanges[formData.difficulty];
        const adjustedTime = Math.min(
          Math.max(estimatedTime, difficultyTimeRange.min),
          difficultyTimeRange.max
        );

        // Check health criteria
        const healthCriteria = checkHealthCriteria(
          { ...meal, readyInMinutes: adjustedTime },
          nutrition
        );

        // Determine meal type
        const mealType = determineMealType(meal);

        // Add allergy information to the recipe
        const allergyInfo = {};
        if (formData.allergies) {
          const userAllergies = formData.allergies.toLowerCase().split(',').map(a => a.trim());
          userAllergies.forEach(allergy => {
            allergyInfo[allergy] = !checkAllergies(meal, allergy);
          });
        }

        return {
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          readyInMinutes: adjustedTime,
          servings: formData.servings || 4,
          ingredients: ingredients,
          instructions: meal.strInstructions
            ? meal.strInstructions
                .split('.')
                .map(step => step.trim())
                .filter(step => step.length > 0)
            : [],
          nutrition: nutrition,
          extendedIngredients: ingredients,
          category: meal.strCategory,
          area: meal.strArea,
          tags: meal.strTags ? meal.strTags.split(',') : [],
          dietaryInfo: {
            isVegetarian: checkDietaryPreferences(meal, 'vegetarian'),
            isVegan: checkDietaryPreferences(meal, 'vegan'),
            isGlutenFree: checkDietaryPreferences(meal, 'gluten free'),
            isDairyFree: checkDietaryPreferences(meal, 'dairy free'),
            isLowCarb: checkDietaryPreferences(meal, 'low carb'),
            isHighProtein: healthCriteria.isHighProtein
          },
          mealType: mealType,
          allergyInfo: allergyInfo,
        };
      });

      // Apply meal type filter
      let filteredRecipes = transformedRecipes;
      if (formData.mealType) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.mealType === formData.mealType
        );
      }

      // Apply additional filters
      if (formData.highProtein) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.isHighProtein);
      }

      if (formData.quickMeal) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.isQuickMeal);
      }

      if (formData.healthy) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryInfo.isHealthy);
      }

      // Sort by cooking time based on difficulty level
      filteredRecipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes);

      if (filteredRecipes.length === 0) {
        setError('Yhtään reseptiä ei löytynyt valitsemillasi hakuehdoilla. Kokeile muuttaa hakua.');
        setRecipes([]);
      } else {
        setRecipes(filteredRecipes);
      }
    } catch (err) {
      console.error('API Error:', err.response || err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch recipes. Please try again.'
      );
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Use useCallback for handlers
  const toggleSaveRecipe = useCallback((recipe) => {
    setSavedRecipes(prev => {
      const isSaved = prev.some(r => r.id === recipe.id);
      if (isSaved) {
        return prev.filter(r => r.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  }, []);

  const handleRecipeClick = useCallback((recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  }, []);

  const toggleExpandRecipe = useCallback((recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  }, [expandedRecipe]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, background: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
              Reseptisuositin
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Main Ingredients Section */}
                <Grid xs="12">
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(46, 125, 50, 0.05)' }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                      Mikä sinun keittiössä on?
                    </Typography>
                    <TextField
                      fullWidth
                      label="Ainekset (pilkulla eroteltuna)"
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      placeholder="esim. chicken, rice, tomatoes"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Annosmäärä"
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      InputProps={{ 
                        inputProps: { min: 1, max: 20 },
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Paper>
                </Grid>

                {/* Preferences Section */}
                <Grid xs="12" md="6">
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(46, 125, 50, 0.05)', height: '100%' }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                      Keittiö & Ateriatyyppi
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Keittiö</InputLabel>
                      <Select
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        label="Keittiö"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">Kaikki keittiöt</MenuItem>
                        {cuisines.map(cuisine => (
                          <MenuItem key={cuisine} value={cuisine}>
                            {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Ateriatyyppi</InputLabel>
                      <Select
                        name="mealType"
                        value={formData.mealType}
                        onChange={handleInputChange}
                        label="Ateriatyyppi"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">Kaikki ateriatyypit</MenuItem>
                        {mealTypes.map(type => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>

                {/* Dietary Preferences */}
                <Grid xs="12" md="6">
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(46, 125, 50, 0.05)', height: '100%' }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                      Ruokavaliot
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Ruokavalio</InputLabel>
                      <Select
                        name="diet"
                        value={formData.diet}
                        onChange={handleInputChange}
                        label="Ruokavalio"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">Kaikki ruokavaliot</MenuItem>
                        {diets.map(diet => (
                          <MenuItem key={diet} value={diet}>
                            {diet}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      Valitse ruokavalio suodattaaksesi reseptejä
                    </Typography>
                  </Paper>
                </Grid>

                {/* Additional Options */}
                <Grid xs="12">
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(46, 125, 50, 0.05)' }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                      Lisäasetukset
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid xs="12" md="6">
                        <Typography gutterBottom>Vaikeustaso</Typography>
                        <Slider
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          min={1}
                          max={5}
                          marks
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => 
                            value === 1 ? 'Helppo' : 
                            value === 3 ? 'Keskitaso' : 
                            value === 5 ? 'Vaikea' : value
                          }
                          sx={{ color: 'primary.main' }}
                        />
                      </Grid>
                      <Grid xs="12" md="6">
                        <FormGroup row sx={{ justifyContent: 'center', gap: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="highProtein"
                                checked={formData.highProtein}
                                onChange={handleInputChange}
                                color="primary"
                              />
                            }
                            label="Runsasproteiininen"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="quickMeal"
                                checked={formData.quickMeal}
                                onChange={handleInputChange}
                                color="primary"
                              />
                            }
                            label="Alle 20 minuuttia"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="healthy"
                                checked={formData.healthy}
                                onChange={handleInputChange}
                                color="primary"
                              />
                            }
                            label="Terveellinen"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Allergies Section */}
                <Grid xs="12">
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(46, 125, 50, 0.05)' }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                      Allergiat & Rajoitukset
                    </Typography>
                    <TextField
                      fullWidth
                      label="Allergiat (pilkulla eroteltuna)"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      placeholder="esim. nuts, shellfish, dairy"
                      sx={{ borderRadius: 2 }}
                    />
                  </Paper>
                </Grid>

                {/* Submit Button */}
                <Grid xs="12">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Etsi täydellisiä reseptejä'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <RecipeList />
          )}
        </Container>

        {savedRecipes.length > 0 && (
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setSelectedRecipe(savedRecipes[0])}
          >
            <Bookmark />
          </Fab>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRecipe && (
          <>
            <DialogTitle>
              <Typography variant="h6" component="div">
                {selectedRecipe.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <CardMedia
                component="img"
                height="300"
                image={selectedRecipe.image || 'https://via.placeholder.com/300x200?text=No+Image+Available'}
                alt={selectedRecipe.title}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              
              <Grid container spacing={3}>
                {/* Recipe Overview */}
                <Grid xs="12">
                  <Paper elevation={0} sx={{ p: 2, mb: 2, background: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h6" component="div" gutterBottom color="primary">
                      Reseptin yleiskatsaus
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Timer color="primary" />
                          <Typography variant="body2" color="textSecondary">
                            Valmisteluaika: {selectedRecipe.readyInMinutes || 'N/A'} min
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <AccessTime color="primary" />
                          <Typography variant="body2" color="textSecondary">
                            Kypsennysaika: {selectedRecipe.readyInMinutes || 'N/A'} min
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Restaurant color="primary" />
                          <Typography variant="body2" color="textSecondary">
                            Annoksia: {selectedRecipe.servings}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <FitnessCenter color="primary" />
                          <Typography variant="body2" color="textSecondary">
                            Kalorit: {selectedRecipe.nutrition?.perServing.calories || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Ingredients Section */}
                <Grid xs="12" md="6">
                  <Paper elevation={0} sx={{ p: 2, background: 'rgba(46, 125, 50, 0.05)', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" component="div" gutterBottom color="primary">
                      Ainekset
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {selectedRecipe.extendedIngredients?.map((ingredient) => (
                        <Box key={ingredient.id} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={`${ingredient.amount} ${ingredient.unit}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            {ingredient.name}
                            {ingredient.original && (
                              <Typography variant="caption" color="textSecondary" display="block">
                                {ingredient.original}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Nutritional Information */}
                <Grid xs="12" md="6">
                  <Paper elevation={0} sx={{ p: 2, background: 'rgba(46, 125, 50, 0.05)', borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" component="div" gutterBottom color="primary">
                      Ravintosisältö
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Chip
                          icon={<FitnessCenter />}
                          label={`Proteiini: ${selectedRecipe.nutrition?.perServing.protein || 'N/A'}g`}
                          sx={{ mb: 1, width: '100%' }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          icon={<TrendingUp />}
                          label={`Kalorit: ${selectedRecipe.nutrition?.perServing.calories || 'N/A'}`}
                          sx={{ mb: 1, width: '100%' }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          icon={<Restaurant />}
                          label={`Hiilihydraatit: ${selectedRecipe.nutrition?.perServing.carbs || 'N/A'}g`}
                          sx={{ mb: 1, width: '100%' }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          icon={<LocalDining />}
                          label={`Rasva: ${selectedRecipe.nutrition?.perServing.fat || 'N/A'}g`}
                          sx={{ mb: 1, width: '100%' }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Instructions Section */}
                <Grid xs="12">
                  <Paper elevation={0} sx={{ p: 2, background: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
                    <Typography variant="h6" component="div" gutterBottom color="primary">
                      Valmistusohjeet
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {selectedRecipe.instructions?.map((step, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            Vaihe {index + 1}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {step}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* Tips and Notes */}
                {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
                  <Grid xs="12">
                    <Paper elevation={0} sx={{ p: 2, background: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
                      <Typography variant="h6" component="div" gutterBottom color="primary">
                        Vinkit & Huomiot
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {selectedRecipe.tips.map((tip, index) => (
                          <Typography component="li" key={index} paragraph>
                            {tip}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Sulje</Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={savedRecipes.some(r => r.id === selectedRecipe.id) ? <Bookmark /> : <BookmarkBorder />}
                onClick={() => toggleSaveRecipe(selectedRecipe)}
              >
                {savedRecipes.some(r => r.id === selectedRecipe.id) ? 'Tallennettu' : 'Tallenna resepti'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
