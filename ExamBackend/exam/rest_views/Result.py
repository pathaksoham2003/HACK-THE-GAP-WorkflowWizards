from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from exam.models import ResultGraph
from exam.serializers import ResultGraphSerializer

class ResultGraphView(APIView):
    def get(self, request):
        try:
            result_graphs = ResultGraph.objects.all()  # Fetch all records
            serializer = ResultGraphSerializer(result_graphs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
