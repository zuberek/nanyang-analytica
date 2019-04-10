import pandas as pd

df = pd.read_csv('../data/labels_and_predictions.csv', encoding='utf-8')
n = len(df)
gender_truth = df['Gender truth']
print(gender_truth.value_counts(), '\n')
gender_prediction = df['Gender prediction']
age_truth = df['Age truth']
print(age_truth.value_counts(), '\n')
age_prediction = df['Age prediction']

TP = 0
TN = 0
FP = 0
FN = 0
for i in range(n):
    if gender_truth[i] == 'Female':
        TP += int(gender_prediction[i] == 'Female')
        FN += int(gender_prediction[i] != 'Female')
    else:
        FP += int(gender_prediction[i] == 'Female')
        TN += int(gender_prediction[i] != 'Female')

accuracy = (TP + TN) / n
precision = TP / (TP + FP)
recall = TP / (TP + FN)
f1 = 2 * precision * recall / (precision + recall)
print('---Gender---')
print('Accuracy: %.3f' % accuracy)
print('Precision: %.3f' % precision)
print('Recall: %.3f' % recall)
print('F-measure: %.3f' % f1)

correct = 0
for i in range(n):
    if age_truth[i] == age_prediction[i]:
        correct += 1
accuracy = correct / n
print('\n---Age---')
print('Accuracy:  %.3f' % accuracy)

for age in ['<25', '25-34', '>34']:
    TP = 0
    TN = 0
    FP = 0
    FN = 0
    for i in range(n):
        if age_truth[i] == age:
            TP += int(age_prediction[i] == age)
            FN += int(age_prediction[i] != age)
        else:
            FP += int(age_prediction[i] == age)
            TN += int(age_prediction[i] != age)

    precision = TP / (TP + FP)
    recall = TP / (TP + FN)
    f1 = 2 * precision * recall / (precision + recall)
    print('\n---{}---'.format(age))
    print('Precision: %.3f' % precision)
    print('Recall: %.3f' % recall)
    print('F-measure: %.3f' % f1)


