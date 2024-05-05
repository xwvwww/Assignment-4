import java.util.*;

public class Edge<V> {
    private V source;
    private V dest;
    private Double weight;

    public Edge(V source, V dest, Double weight) {
        this.source = source;
        this.dest = dest;
        this.weight = weight;
    }

    public V getSource() {
        return source;
    }

    public V getDest() {
        return dest;
    }

    public Double getWeight() {
        return weight;
    }
}
