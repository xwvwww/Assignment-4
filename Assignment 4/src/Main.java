import java.util.*;

public class Main {
    public static void main(String[] args) {
        WeightedGraph<String> graph = new WeightedGraph<>(true);

        Vertex<String> almaty = new Vertex<>("Almaty");
        Vertex<String> astana = new Vertex<>("Astana");
        Vertex<String> shymkent = new Vertex<>("Shymkent");
        Vertex<String> kostanay = new Vertex<>("Kostanay");
        Vertex<String> kyzylorda = new Vertex<>("Kyzylorda");

        graph.addEdge(almaty.getData(), astana.getData(), 2.1);
        graph.addEdge(almaty.getData(), shymkent.getData(), 7.2);
        graph.addEdge(shymkent.getData(), astana.getData(), 3.9);
        graph.addEdge(astana.getData(), kostanay.getData(), 3.5);
        graph.addEdge(shymkent.getData(), kyzylorda.getData(), 5.4);

        System.out.println("Dijkstra:");
        Search<String> djk = new DijkstraSearch<>(graph, almaty.getData());
        outputPath(djk, kyzylorda);

//        System.out.println("DFS:");
//        Search<String> dfs = new DepthFirstSearch<>(graph, "Almaty");
//        outputPath(dfs, "Kyzylorda");
//
//        System.out.println("\n--------------------------------");
//
//        System.out.println("BFS:");
//        Search<String> bfs = new BreadthFirstSearch<>(graph, "Almaty");
//        outputPath(bfs, "Kyzylorda");
    }

    public static void outputPath(Search<String> search, Vertex<String> key) {
        for (String v : search.pathTo(key.getData())) {
            System.out.print(v + " -> ");
        }
    }
}
