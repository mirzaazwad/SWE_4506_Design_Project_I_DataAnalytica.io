from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from library.data_preprocessing import DataProcessing
from library.model import Model
from library.classification_analysis import ClassificationAnalysis
from library.regression_analysis import RegressionAnalysis
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.decomposition import PCA


class decisionTreeClassification(APIView):
    queryset = []

    permission_classes = []
    def get(self, request):
        return Response('Decison Tree Model Working...', status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            requestBody = request.data
            depth = requestBody.get('max_depth', None)
            criter = requestBody.get('criterion', None)
            split_data = requestBody.get('train_test_split', None)
            targetCol = requestBody.get('target', None)
            normalization = requestBody.get('normalization', None)
            pca = requestBody.get('pca', False)
            pca_features = requestBody.get('pca_features', None)
            X_train, X_test, y_train, y_test = DataProcessing(requestBody['file_url'],targetCol,'class',"text/csv",split_data).get_processed_data_with_split()
            if pca is True:
                X_train=PCA(n_components=pca_features).fit_transform(X_train)
                X_test=PCA(n_components=pca_features).fit_transform(X_test)
            if criter is not None:
                model = Model(DecisionTreeClassifier(criterion=criter,max_depth=depth),normalization).get_model()
            else:
                model = Model(DecisionTreeClassifier(max_depth=depth),normalization).get_model()
            model.fit(X_train,y_train)
            return Response(ClassificationAnalysis(model,X_train,X_test,y_train,y_test).to_json(), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
class decisionTreeRegression(APIView):
    queryset = []

    permission_classes = []
    
    def post(self, request):
        try:
            requestBody = request.data
            depth = requestBody.get('max_depth', None)
            criter = requestBody.get('criterion', None)
            split_data = requestBody.get('train_test_split', None)
            targetCol = requestBody.get('target', None)
            normalization = requestBody.get('normalization', None)
            X_train, X_test, y_train, y_test = DataProcessing(requestBody['file_url'],targetCol,'regression',"text/csv",split_data).get_processed_data_with_split()
            pca = requestBody.get('pca', False)
            pca_features = requestBody.get('pca_features', None)
            if pca is True:
                X_train=PCA(n_components=pca_features).fit_transform(X_train)
                X_test=PCA(n_components=pca_features).fit_transform(X_test)
            if criter is not None:
                model = Model(DecisionTreeRegressor(criterion=criter,max_depth=depth),normalization).get_model()
            else:
                model = Model(DecisionTreeRegressor(max_depth=depth),normalization).get_model()
            model.fit(X_train,y_train)
            return Response(RegressionAnalysis(model,X_train,X_test,y_train,y_test).to_json(), status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)