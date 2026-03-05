import { KaggleProject } from "../interfaces";

export const NeuralNetworkFromScratch: KaggleProject = 
    {
    id: "kaggle-3",
    title: "Neural Network From Scratch",
    date: "2025-12-28",
    githubUrl: 'https://github.com/amJenish/Neural-Network-From-Scratch',
    description: `

built a neural network from scratch, only relying on numPy and math library for the production.

## About the project
The goal of this project is to learn and demonstrate the mathematics and inner mechanics of neural networks by building one from scratch. Unlike using high-level libraries like PyTorch or TensorFlow, this project focuses on implementing all essential components manually, providing a deeper understanding of:
- Neuron structure and computations
- Activation functions and their derivatives
- Loss functions and their gradients
- Forward and backward propagation
- Weight and bias updates during training

This project is for learning purposes and builds basic foundation for a custom neural network.

## Classes and Components

### 1. \`ActivationFunction\`  
Encapsulates different activation functions and their derivatives.  
Supported functions:  

- **Linear**: \( f(x) = x \)  
- **Sigmoid**: \( f(x) = \frac{1}{1 + e^{-x}} \)  
- **Tanh**: \( f(x) = \tanh(x) \)  
- **ReLU**: \( f(x) = \max(0, x) \)  
- **Leaky ReLU**: \( f(x) = x \text{ if } x>0 \text{ else } \alpha x \)  

**Purpose:** Easy extension to new activation functions and consistent gradient computation.

---

### 2. \`LossFunction\`  
Handles computation of loss and gradient for training.  

Supported functions:  

- **MSE (Mean Squared Error)**: Regression tasks  
- **MAE (Mean Absolute Error)**: Regression tasks  
- **Binary Cross-Entropy (BCE)**: Binary classification tasks  

**Purpose:** Centralized loss computation and gradient calculation for backpropagation.

---

### 3. \`Neuron\`  
Represents a single neuron in the network.

- Contains weight vector corresponding to the number of inputs (neurons in the previous layer)  
- Stores bias  
- Implements forward propagation through its activation function  
- Updates weights and bias using backpropagation with gradient clipping  

**Purpose:** Modular building block for constructing layers.

---

### 4. \`Network\`  
Represents a full feedforward neural network.

- Composed of layers of neurons  
- Implements forward propagation through all layers  
- Implements backward propagation for training  
- Methods:
  - \`fit()\`: Trains the network on given data for specified epochs  
  - \`predict()\`: Outputs predictions for new data  

**Purpose:** Provides end-to-end neural network training and inference.

---

## Features

- Fully manual implementation with no high-level ML libraries  
- Supports multiple activation and loss functions  
- Gradient clipping to stabilize training  
- Designed to best fit for binary classification tasks  
- Extensible for new layers, activation, or loss functions  
    `
  }