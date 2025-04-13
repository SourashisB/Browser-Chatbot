# train_chatbot.py - Training script for the neural network
import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from keras.api.models import Sequential
from keras.api.layers import Dense, Dropout
from keras.api.optimizers import SGD

# Download necessary NLTK data
nltk.download('punkt_tab', quiet=True)
nltk.download('wordnet', quiet=True)

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Load the intents file
with open('intents.json', 'r') as file:
    intents = json.load(file)

# Lists to store data
words = []
classes = []
documents = []
ignore_letters = ['?', '!', '.', ',']

# Process each intent and pattern
for intent in intents['intents']:
    for pattern in intent['patterns']:
        # Tokenize each word
        word_list = nltk.word_tokenize(pattern)
        words.extend(word_list)
        # Add documents to corpus
        documents.append((word_list, intent['tag']))
        # Add classes
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize and filter words
words = [lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore_letters]
words = sorted(list(set(words)))  # Remove duplicates and sort

# Sort classes
classes = sorted(list(set(classes)))

# Save words and classes
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

# Prepare training data
training = []
output_empty = [0] * len(classes)

for document in documents:
    # Bag of words for each pattern
    bag = []
    word_patterns = document[0]
    word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]
    
    # Create bag of words array
    for word in words:
        bag.append(1) if word in word_patterns else bag.append(0)
    
    # Create output row with 1 at index of current tag
    output_row = list(output_empty)
    output_row[classes.index(document[1])] = 1
    
    training.append([bag, output_row])

# Shuffle and convert to numpy array
random.shuffle(training)
training = np.array(training, dtype=object)

# Split into features and labels
train_x = np.array([item[0] for item in training])
train_y = np.array([item[1] for item in training])

# Build neural network model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile model
sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train model
hist = model.fit(train_x, train_y, epochs=200, batch_size=5, verbose=1)

# Save model
model.save('chatbot_model.h5')
print("Model created and saved!")