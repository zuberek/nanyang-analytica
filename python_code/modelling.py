import math
import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt
import keras.backend as K
from functools import reduce
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.optimizers import Adam, RMSprop
from keras.models import Sequential, Model
from keras.layers import Dense, Dropout, Input, BatchNormalization
from keras.layers import Embedding, GRU
from keras.layers import Bidirectional, TimeDistributed
from keras.utils import to_categorical
from keras.utils.vis_utils import model_to_dot


### Setup hyperparameters
CV = 5                    # Number of cross-validation folds
MAX_WORDS = 10            # Maximum number of words in a tweet
MAX_CHARS = 10            # Maximum number of characters in a word
VOCAB_SIZE = 0            # This is set in read_data by the tokenizer
LEARNING_RATE = 0.001
BATCH_SIZE = 256
EPOCHS = 20
SEED = 123

### Setup configurations
np.random.seed(SEED)
tf.set_random_seed(SEED)
tf.logging.set_verbosity(tf.logging.ERROR)
plt.style.use('ggplot')


def main():
    personality_regression()


def gender_classification():
    ### Read tokenized tweets and gender targets
    label = 'sex'
        X, Y, user_boundaries = read_data(label)

        ### Perform 5-fold cross-validation
        cross_validate_gender(X, Y, user_boundaries)
            
            ### Train on all examples and export model
            print('Training final model...')
            final_model = build_model(num_of_classes=2)
            weight0 = len(Y) / Y.tolist().count(0)
            weight1 = len(Y) / Y.tolist().count(1)
            class_weight = {0: weight0, 1: weight1}
                final_model.fit(X, Y, batch_size=BATCH_SIZE, epochs=EPOCHS, class_weight=class_weight)
                final_model.save(label + '.h5')
                print('Model successfully exported!')


def age_classification():
    ### Read tokenized tweets and age targets
    label = 'age'
        X, Y, user_boundaries = read_data(label)

        ### Perform 5-fold cross-validation
        cross_validate_age(X, Y, user_boundaries)
            
            ### Train on all examples and export model
            print('Training final model...')
            final_model = build_model(num_of_classes=3)
            weight0 = len(Y) / Y.tolist().count(0)
            weight1 = len(Y) / Y.tolist().count(1)
            weight2 = len(Y) / Y.tolist().count(2)
            class_weight = {0: weight0, 1: weight1, 2: weight2}
                final_model.fit(X, to_categorical(Y, num_classes=3), batch_size=BATCH_SIZE, epochs=EPOCHS, class_weight=class_weight)
                final_model.save(label + '.h5')
                print('Model successfully exported!')


def cross_validate_gender(X, Y, user_boundaries):
    # Calculate users per fold
    upf = len(user_boundaries) // CV
    
    cv_user_acc = []
    cv_tweet_acc = []
        cv_recall = []
        cv_precision = []
        cv_f1 = []
        for i in range(CV):
            print('Cross-validation fold %d/%d...' % (i+1, CV))
            model = build_model(num_of_classes=2)
        
            fold_start = user_boundaries[i * upf]
fold_end = user_boundaries[(i+1) * upf]
x_train = np.concatenate((X[:fold_start], X[fold_end:]))
y_train = np.concatenate((Y[:fold_start], Y[fold_end:]))
x_test = X[fold_start:fold_end]
y_test = Y[fold_start:fold_end]

weight0 = len(y_train) / y_train.tolist().count(0)
weight1 = len(y_train) / y_train.tolist().count(1)
class_weight = {0: weight0, 1: weight1}
    hist = model.fit(x_train, y_train, batch_size=BATCH_SIZE, validation_data=(x_test, y_test), epochs=EPOCHS, verbose=1)
    
    y_pred = list(map(lambda x: int(round(x[0])), model.predict(x_test)))
    correct_user_preds = 0
    for j in range(i * upf, (i + 1) * upf):
        user_start = user_boundaries[j] - user_boundaries[i * upf]
        user_end = user_boundaries[j+1] - user_boundaries[i * upf]
        user_preds = y_pred[user_start:user_end]
        prediction = max(set(user_preds), key=list(user_preds).count)
        truth = y_test[user_start]
        print('Prediction: {}, Truth: {}'.format(prediction, truth))
        correct_user_preds += int((truth == prediction))
    
    cv_recall.append(recall(y_test, y_pred, 1))
    cv_precision.append(precision(y_test, y_pred, 1))
    cv_f1.append(f1_score(y_test, y_pred, 1))
    
    cv_user_acc.append(correct_user_preds / upf)
    cv_tweet_acc.append(hist.history['val_acc'][-1])
    print('User level acc: %.3f' % (cv_user_acc[i]))
    print('Tweet level acc: %.3f' % (cv_tweet_acc[i]))
    
    plot_history(hist, True)
        
        print('Cross-validation accuracy on tweets: %.3f' % (sum(cv_tweet_acc) / CV))
        print('Cross-validation accuracy on users: %.3f'% (sum(cv_user_acc) / CV))
        print('Cross-validation recall: %.3f' % (sum(cv_recall) / CV))
        print('Cross-validation precision: %.3f' % (sum(cv_precision) / CV))
        print('Cross-validation f-measure: %.3f' % (sum(cv_f1) / CV))


def cross_validate_age(X, Y, user_boundaries):
    # Calculate users per fold
    upf = len(user_boundaries) // CV

    cv_user_acc = []
    cv_tweet_acc = []
        cv_recall = [[], [], []]
        cv_precision = [[], [], []]
        cv_f1 = [[], [], []]
        for i in range(CV):
            print('Cross-validation fold %d/%d...' % (i+1, CV))
            model = build_model(num_of_classes=3)
        
            fold_start = user_boundaries[i * upf]
fold_end = user_boundaries[(i+1) * upf]
x_train = np.concatenate((X[:fold_start], X[fold_end:]))
y_train = np.concatenate((Y[:fold_start], Y[fold_end:]))
x_test = X[fold_start:fold_end]
y_test = Y[fold_start:fold_end]

weight0 = len(y_train) / y_train.tolist().count(0)
weight1 = len(y_train) / y_train.tolist().count(1)
weight2 = len(y_train) / y_train.tolist().count(2)
class_weight = {0: weight0, 1: weight1, 2: weight2}
    hist = model.fit(x_train, to_categorical(y_train, num_classes=3), batch_size=BATCH_SIZE, validation_data=(x_test, to_categorical(y_test, num_classes=3)), epochs=EPOCHS, class_weight=class_weight, verbose=1)
    
    y_pred = np.argmax(model.predict(x_test), axis=1)
    correct_user_preds = 0
    for j in range(i * upf, (i + 1) * upf):
        user_start = user_boundaries[j] - user_boundaries[i * upf]
        user_end = user_boundaries[j+1] - user_boundaries[i * upf]
        user_preds = y_pred[user_start:user_end]
        prediction = max(set(user_preds), key=list(user_preds).count)
        truth = y_test[user_start]
        print('Prediction: {}, Truth: {}'.format(prediction, truth))
        correct_user_preds += int((truth == prediction))

    for j in range(3):
        cv_recall[j] = cv_recall[j] + [recall(y_test, y_pred, j)]
        cv_precision[j] = cv_precision[j] + [precision(y_test, y_pred, j)]
        cv_f1[j] = cv_f1[j] + [f1_score(y_test, y_pred, j)]

cv_user_acc.append(correct_user_preds / upf)
cv_tweet_acc.append(hist.history['val_acc'][-1])
print('User level acc: %.3f' % (cv_user_acc[i]))
print('Tweet level acc: %.3f' % (cv_tweet_acc[i]))

    plot_history(hist, True)
        
        print('Cross-validation accuracy on tweets: %.3f' % (sum(cv_tweet_acc) / CV))
        print('Cross-validation accuracy on users: %.3f'% (sum(cv_user_acc) / CV))
        for i in range(3):
            print('Cross-validation recall on class %d: %.3f' % (i, sum(cv_recall[i]) / CV))
            print('Cross-validation precision on class %d: %.3f' % (i, sum(cv_precision[i]) / CV))
            print('Cross-validation f-measure on class %d: %.3f' % (i, sum(cv_f1[i]) / CV))


def personality_regression():
    ### Read tokenized tweets and personality targets
    personality_types = ['ext', 'sta', 'agr', 'con', 'opn']
    label = personality_types[2]
    X, Y, user_boundaries = read_data(label)

    ### Perform 5-fold cross-validation
    cross_validate_regression(X, Y, user_boundaries)
    
    ### Normalize outputs to be contained in interval [0, 1] for deployment
    y_min = min(Y)
        y_max = max(Y)
        Y_norm = np.array(list(map(lambda y: (y-y_min)/(y_max-y_min), Y)))

        ### Train on normalized outputs and export model
        print('Training final model...')
            final_model = build_model()
            final_model.fit(X, Y_norm, batch_size=BATCH_SIZE, epochs=EPOCHS)
            final_model.save(label + '.h5')
            print('Model successfully exported!')


def cross_validate_regression(X, Y, user_boundaries):
    # Calculate users per fold
    upf = len(user_boundaries) // CV
    
    cv_user_errors = []
    cv_tweet_errors = []
        for i in range(CV):
            print('Cross-validation fold %d/%d...' % (i+1, CV))
            model = build_model()

fold_start = user_boundaries[i * upf]
fold_end = user_boundaries[(i+1) * upf]
x_train = np.concatenate((X[:fold_start], X[fold_end:]))
y_train = np.concatenate((Y[:fold_start], Y[fold_end:]))
x_test = X[fold_start:fold_end]
y_test = Y[fold_start:fold_end]

hist = model.fit(x_train, y_train, batch_size=BATCH_SIZE, validation_data=(x_test, y_test), epochs=EPOCHS, verbose=1)

y_pred = list(map(lambda x: x[0], model.predict(x_test)))
squared_error = 0
    for j in range(i * upf, (i + 1) * upf):
        user_start = user_boundaries[j] - user_boundaries[i * upf]
        user_end = user_boundaries[j+1] - user_boundaries[i * upf]
        prediction = sum(y_pred[user_start:user_end])/(user_end - user_start)
        truth = y_test[user_start]
        print('Prediction: {:.2f}, Truth: {:.2f}'.format(prediction, truth))
        squared_error += (truth - prediction) ** 2
    
    cv_user_errors.append(math.sqrt(squared_error / upf))
    cv_tweet_errors.append(math.sqrt(np.mean(np.square(y_pred-y_test))))
    
    print('User level loss: %.3f' % (cv_user_errors[i]))
    print('Tweet level loss: %.3f' % (cv_tweet_errors[i]))
    
    plot_history(hist, False)
        
        print('Cross-validation RMSE on tweets: %.3f' % (sum(cv_tweet_errors) / CV))
        print('Cross-validation RMSE on users: %.3f \n\n'% (sum(cv_user_errors) / CV))


def build_word_encoder(drop_rate, char_GRU_cells):
    input_layer = Input(shape=(MAX_CHARS, VOCAB_SIZE))
    char_bi_rnn = Bidirectional(GRU(char_GRU_cells))(input_layer)
    word_encoder = Model(inputs=input_layer, outputs=char_bi_rnn)
    
        return word_encoder


def build_model(drop_rate=0.5, char_GRU_cells=32, word_GRU_cells=32, dense_neurons=32, num_of_classes=None):
    word_encoder = build_word_encoder(drop_rate, char_GRU_cells)

    input_layer = Input(shape=(MAX_WORDS, MAX_CHARS, VOCAB_SIZE))
    word_embeddings = TimeDistributed(word_encoder)(input_layer)
        word_bi_rnn = Bidirectional(GRU(word_GRU_cells), merge_mode='concat')(word_embeddings)
        word_bi_rnn = Dropout(drop_rate)(word_bi_rnn)
        fc_layer = Dense(dense_neurons, activation='relu')(word_bi_rnn)
    
        if num_of_classes is None:
# Personality Regression
output_layer = Dense(1)(fc_layer)
model = Model(inputs=input_layer, outputs=output_layer)
model.compile(loss='mean_squared_error', optimizer=Adam(LEARNING_RATE))
    elif num_of_classes == 2:
    # Gender Classification
    output_layer = Dense(1, activation='sigmoid')(fc_layer)
    model = Model(inputs=input_layer, outputs=output_layer)
    model.compile(loss='binary_crossentropy', optimizer=Adam(LEARNING_RATE), metrics=['accuracy'])
        else:
# Age Classification
output_layer = Dense(num_of_classes, activation='softmax')(fc_layer)
model = Model(inputs=input_layer, outputs=output_layer)
model.compile(loss='categorical_crossentropy', optimizer=Adam(LEARNING_RATE), metrics=['accuracy'])
    
    return model


def read_data(label):
    global VOCAB_SIZE, Y_MEAN
        
        ### Read data set from github
        url = 'https://github.com/FIREF1YME/CZ4034-Information-Retrieval-Group-15/raw/master/train.csv'
            data = pd.read_csv(url)
            x = data['tweet']
            y = data[label]
            Y_MEAN = y.mean()
            users = data['user']

            ### Split tweets into word sequences
            x_words = x.apply(lambda tweet: tweet.split(' '))
                
                ### Create character tokenizer
                tokenizer = Tokenizer(
                                      filters=None,
                                      char_level=True,
                                      #lower=False,
                                      oov_token='UNK'
                                      )
                    tokenizer.fit_on_texts(reduce(lambda x, y: x+y, x_words))
                    VOCAB_SIZE = len(tokenizer.word_index) + 1
                    print(tokenizer.word_index)
                    
                    ### Tokenize and pad/truncate
                    X = np.empty((x_words.size, MAX_WORDS, MAX_CHARS, VOCAB_SIZE))
                        for i, word_seq in enumerate(x_words):
                            x_i = tokenizer.texts_to_sequences(word_seq)
                            x_i = pad_sequences(x_i, maxlen=MAX_CHARS, padding='post') # Pad char seqs
                            
                            if x_i.shape[0] < MAX_WORDS:
                                # Pad word seqs with zero vectors
                                x_i = np.concatenate((x_i, np.zeros((MAX_WORDS-x_i.shape[0], MAX_CHARS))))
                                    elif x_i.shape[0] > MAX_WORDS:
                                        # Truncate
                                        x_i = x_i[:MAX_WORDS]
                                            
                                            x_i = to_categorical(x_i, VOCAB_SIZE)
                                            X[i] = x_i
                                                
                                                ### Find indexes where the tweets of new users begin
                                                user_boundaries = [0]
                                                for i in range(1, users.size):
                                                    if users[i] != users[i-1]:
                                                        user_boundaries.append(i)
                                                            
                                                            return X, np.array(y), user_boundaries


def plot_history(model, show_acc):
    history = model.history
        loss = history['loss']
        val_loss = history['val_loss']
        x = range(1, len(loss) + 1)
        plt.figure()

        if(show_acc):
acc = history['acc']
val_acc = history['val_acc']

    plt.subplot(1,2,1)
    plt.plot(x, acc, 'b', label='Training acc')
    plt.plot(x, val_acc, 'r', label='Validation acc')
    plt.title('Acccuracy')
    plt.legend()
    plt.subplot(1,2,2)
        
        plt.plot(x, loss, 'b', label='Training loss')
        plt.plot(x, val_loss, 'r', label='Validation loss')
        plt.title('Loss')
        plt.legend()
        plt.show()


def recall(y_true, y_pred, desired_class):
    TP = 0
    FN = 0
    
    for i in range(len(y_true)):
        if(y_true[i] == desired_class):
            TP += int(y_pred[i] == y_true[i])
            FN += int(y_pred[i] != y_true[i])
    
    return TP/(TP+FN)


def precision(y_true, y_pred, desired_class):
    TP = 0
        FP = 0
            
            for i in range(len(y_pred)):
                if(y_pred[i] == desired_class):
                    TP += int(y_true[i] == y_pred[i])
                    FP += int(y_true[i] != y_pred[i])
                        
                        return TP/(TP+FP)


def f1_score(y_true, y_pred, desired_class):
    p = precision(y_true, y_pred, desired_class)
    r = recall(y_true, y_pred, desired_class)
    
        return 2*p*r / (p + r)


if __name__ == '__main__':
    main()
